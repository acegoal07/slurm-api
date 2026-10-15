import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { InternalServerErrorSchema } from '../../../../lib/errors/schemas';
import { slurmFetch } from '../../../../lib/slurmSocket';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: 'Gets all the current jobs',
      tags: ['vem2'],
      responses: {
         204: {
            description: 'Retrieved all the current jobs successfully'
         },
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      await slurmFetch('get', '/slurm/v0.0.45/jobs/').then((res) => res.json()).then((data) => {
         console.log(data)
      })

      return c.body(null, 204);
   }
);
