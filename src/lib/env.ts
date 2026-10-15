import 'dotenv/config';

import { z } from '@hono/zod-openapi';

const envSchema = z.object({
   PORT: z.coerce.number().int().min(1).max(65535).default(3000),
   SLURM_UNIX_SOCKET: z.coerce.string().default('/tmp/slurmrestd-test.sock')
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
