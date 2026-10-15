import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';

import { InternalServerErrorSchema, NotFoundErrorSchema } from '../../../../lib/errors/schemas';
import { ensureFlavourExists } from '../lib/helpers';
import { flavourReturnSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: 'Get all flavours',
      tags: ['Flavours'],
      request: {
         params: z.object({
            name: z.string().min(1)
         })
      },
      responses: {
         200: {
            description: 'The specified flavour',
            content: {
               'application/json': {
                  schema: flavourReturnSchema
               }
            }
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      const { name } = c.req.valid('param');
      return c.json(await ensureFlavourExists(name), 200);
   }
);
