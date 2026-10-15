import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { InternalServerErrorSchema } from '../../../../lib/errors/schemas';
import { getAllFlavours } from '../lib/helpers';
import { flavourReturnSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: 'Get all flavours',
      tags: ['Flavours'],
      responses: {
         200: {
            description: 'List of flavours',
            content: {
               'application/json': {
                  schema: flavourReturnSchema.array()
               }
            }
         },
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      return c.json(await getAllFlavours(), 200);
   }
);
