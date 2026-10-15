import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { InternalServerErrorSchema } from '../../../../lib/errors/schemas';
import { slurmFetch } from '../../../../lib/slurmSocket';
import { JobReturnSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: `Get's a specific job using it's ID`,
      tags: ['vem2'],
      request: {
         params: z.object({
            id: z.coerce
               .number({ error: 'ID must be a number' })
               .int({ error: 'ID must be a whole number' })
               .min(1, { error: 'ID must be more than 0' })
         })
      },
      responses: {
         200: {
            description: 'Retrieved the specific job successfully',
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
      const { id } = c.req.valid('param');

      const job =
         (
            await slurmFetch('get', `job/${id}/?flags=DETAIL`).then((res) =>
               res.json()
            )
         ).jobs ?? [];

      return c.json(
         job.map((job) => ({
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
