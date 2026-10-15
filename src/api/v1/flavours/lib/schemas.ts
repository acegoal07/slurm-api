import { z } from '@hono/zod-openapi';

/**
 * Flavour return schema
 */
export const flavourReturnSchema = z.object({
   name: z.string(),
   memoryGb: z.int(),
   cpus: z.int()
});
