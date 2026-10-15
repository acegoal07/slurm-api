import { z } from '@hono/zod-openapi';

/**
 * Job return zod schema schema
 */
export const JobReturnSchema = z.object({
   id: z.int(),
   name: z.string(),
   partition: z.string(),
   account: z.string(),
   hostname: z.string().nullable(),
   flavour: z.string(),
   runtime: z.number(),
   states: z.string()
});
