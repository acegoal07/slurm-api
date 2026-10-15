import { OpenAPIHono } from '@hono/zod-openapi';

import jobs from './jobs';

export default new OpenAPIHono().route('/jobs', jobs);
