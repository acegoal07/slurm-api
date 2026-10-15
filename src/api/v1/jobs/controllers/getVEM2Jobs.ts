import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { env } from '../../../../lib/env';
import { InternalServerErrorSchema } from '../../../../lib/errors/schemas';
import { slurmFetch } from '../../../../lib/slurmSocket';
import { JobReturnSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: `Get's all the current viz jobs`,
      tags: ['vem2'],
      responses: {
         200: {
            description: 'Retrieved all the current viz jobs successfully',
            content: {
               'application/json': {
                  schema: JobReturnSchema
               }
            }
         },
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      const jobs = (
         (await slurmFetch('get', 'jobs/?flags=DETAIL').then((res) => res.json())).jobs ?? []
      ).filter((job) => job.name.startsWith(env.VEM2_NAME_PREFIX));

      return c.json(
         (jobs ?? []).map((job) => ({
            id: job.job_id,
            name: job.name,
            partition: job.partition,
            account: job.account,
            state: job.job_state
         })),
         200
      );
   }
);
