import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { BadRequestErrorSchema, InternalServerErrorSchema } from '../../../../lib/errors/schemas';
import { ensureFlavourExists } from '../../flavours/lib/helpers';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'delete',
      path: '/',
      description: `Cancels a job using it's ID`,
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
            description: 'Successfully canceled the job'
         },
         ...BadRequestErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      const body = c.req.valid('json');

      await ensureFlavourExists(body.flavour);

      return c.body(null, 204);
   }
);
