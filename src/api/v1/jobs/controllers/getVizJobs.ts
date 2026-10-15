import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { InternalServerErrorSchema } from '../../../../lib/errors/schemas';
import { slurmFetch } from '../../../../lib/slurmSocket';
import { JobReturnSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: 'Gets all the current viz jobs',
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
         (await slurmFetch('get', '/slurm/v0.0.45/jobs/').then((res) => res.json())).jobs ?? []
      ).filter((job) => job.partition === 'debug');

      return c.json(
         (jobs ?? []).map((job) => ({
            id: job.job_id,
            name: job.name,
            partition: job.partition,
            account: job.account
         })),
         200
      );
   }
);
