import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { env } from '../../../../lib/env';
import APIError, { APIErrorCode } from '../../../../lib/errors/apiError';
import { InternalServerErrorSchema, NotFoundErrorSchema } from '../../../../lib/errors/schemas';
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
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      const { id } = c.req.valid('param');

      const job = (
         (await slurmFetch('get', `job/${id}/?flags=DETAIL`).then((res) => res.json())).jobs ?? []
      ).filter(
         (job) =>
            job.job_state.some((state) => ['RUNNING', 'PENDING'].includes(state)) &&
            job.name.startsWith(env.VEM2_NAME_PREFIX)
      );

      if (job.length === 0) {
         throw new APIError(APIErrorCode.NotFound, {
            error: 'No VEM2 job was found with that ID'
         });
      }

      return c.json(
         job.map((job) => {
            const [hostname, ...parts] = job.name.split('.');
            const flavour = parts.join('.');

            return {
               id: job.job_id,
               name: job.name,
               partition: job.partition,
               account: job.account,
               hostname: job.job_state === 'PENDING' ? null : hostname,
               flavour,
               runtime: Math.max(0, Math.floor(Date.now() / 1000) - job.start_time.number),
               states: job.job_state
            };
         }),
         200
      );
   }
);
