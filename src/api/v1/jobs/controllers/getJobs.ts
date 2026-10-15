import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { InternalServerErrorSchema } from '../../../../lib/errors/schemas';
import { slurmFetch } from '../../../../lib/slurmSocket';
import { JobReturnSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: `Get's all the current jobs`,
      tags: ['vem2'],
      responses: {
         200: {
            description: 'Retrieved all the current jobs successfully',
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
      const jobs =
         (await slurmFetch('get', 'jobs/?flags=DETAIL').then((res) => res.json()))
            .jobs ?? [];

      return c.json(
         jobs.map((job) => ({
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
