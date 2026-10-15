import { OpenAPIHono } from '@hono/zod-openapi';

import getJobs from './controllers/getJobs';

export default new OpenAPIHono().route('/', getJobs);
