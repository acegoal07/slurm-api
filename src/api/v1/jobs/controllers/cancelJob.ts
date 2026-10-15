import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { InternalServerErrorSchema } from '../../../../lib/errors/schemas';
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
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      const { id } = c.req.valid('param');

      const test = await slurmFetch('delete', `/slurm/v0.0.45/job/${id}`).then((res) => res.json());

      console.log(test.status);

      return c.body(null, 204);
   }
);
