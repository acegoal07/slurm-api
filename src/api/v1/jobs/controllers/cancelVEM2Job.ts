import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { env } from '../../../../lib/env';
import APIError, { APIErrorCode } from '../../../../lib/errors/apiError';
import { InternalServerErrorSchema, NotFoundErrorSchema } from '../../../../lib/errors/schemas';
import { slurmFetch } from '../../../../lib/slurmSocket';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'delete',
      path: '/',
      description: `Cancels a job using it's ID`,
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
         204: {
            description: 'Successfully canceled the job'
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

      await slurmFetch('delete', `job/${id}`).then((res) => res.json());

      return c.body(null, 204);
   }
);
