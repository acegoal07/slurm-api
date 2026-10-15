import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { z } from '@hono/zod-openapi';

import { env } from '../../../../lib/env';
import APIError, { APIErrorCode } from '../../../../lib/errors/apiError';
import { flavourReturnSchema } from './schemas';

type Flavour = z.infer<typeof flavourReturnSchema>;

function parseSbatchFile(content: string) {
   let memory: string | undefined;
   let cpus: number | undefined;

   for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*#SBATCH\s+(.*)$/);
      if (!match) {
         if (line.trim() && !line.trimStart().startsWith('#')) break;
         continue;
      }

      const directive = match[1];

      const getValue = (option: string): string | undefined => {
         const escaped = option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         const result = new RegExp(
            new RegExp(String.raw`(?:^|\s)${escaped}(?:=|\s+)(?:"([^"]*)"|'([^']*)'|(\S+))`)
         ).exec(directive);
         return result?.[1] ?? result?.[2] ?? result?.[3];
      };

      memory = getValue('--mem') ?? memory;

      const cpuValue = getValue('--cpus-per-task') ?? getValue('-c');
      if (cpuValue !== undefined) cpus = Number(cpuValue);
   }

   if (!memory || !/^(\d+)([KMGTP])?$/i.test(memory) || !Number.isInteger(cpus) || cpus! < 1) {
      return null;
   }

   const [, amount, unit = 'M'] = new RegExp(/^(\d+)([KMGTP])?$/i).exec(memory)!;
   const unitsInGb: Record<string, number> = {
      K: 1 / (1024 * 1024),
      M: 1 / 1024,
      G: 1,
      T: 1024,
      P: 1024 * 1024
   };

   const memoryGb = Math.ceil(Number(amount) * unitsInGb[unit.toUpperCase()]);

   return { memoryGb, cpus };
}

export async function getAllFlavours(): Promise<Flavour[]> {
   const entries = await readdir(env.FLAVOURS_PATH, {
      withFileTypes: true
   });

   const results = await Promise.all(
      entries
         .filter((entry) => entry.isFile())
         .map(async (entry) => {
            try {
               const content = await readFile(path.join(env.FLAVOURS_PATH, entry.name), 'utf8');

               const parsed = parseSbatchFile(content);
               if (!parsed) return null;

               return flavourReturnSchema.safeParse({
                  name: entry.name,
                  ...parsed
               });
            } catch {
               return null;
            }
         })
   );

   return results.flatMap((result) => (result?.success ? [result.data] : []));
}

export async function ensureFlavourExists(flavour: string): Promise<Flavour> {
   const flavours = await getAllFlavours();

   const found = flavours.find((item) => item.name === flavour);

   if (!found) {
      throw new APIError(APIErrorCode.NotFound, {
         error: `Flavour with name ${flavour} could not be found`
      });
   }

   return found;
}
