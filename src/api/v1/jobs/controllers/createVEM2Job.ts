import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { env } from '../../../../lib/env';
import { InternalServerErrorSchema, NotFoundErrorSchema } from '../../../../lib/errors/schemas';
import { slurmFetch } from '../../../../lib/slurmSocket';
import { ensureFlavourExists } from '../../flavours/lib/helpers';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'post',
      path: '/',
      description: `Create a VEM2`,
      tags: ['vem2'],
      request: {
         body: {
            content: {
               'application/json': {
                  schema: z.object({
                     flavour: z.string()
                  })
               }
            }
         }
      },
      responses: {
         204: {
            description: 'Successfully created a VEM2'
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      const body = c.req.valid('json');

      await ensureFlavourExists(body.flavour);

      // Read the flavour file
      const script = readFileSync(path.join(env.FLAVOURS_PATH, body.flavour), 'utf8');

      console.log(script);

      const response = await slurmFetch('post', 'job/submit', {
         body: JSON.stringify({
            job: {},
            script
         })
      });

      console.log(response);

      return c.body(null, 204);
   }
);
