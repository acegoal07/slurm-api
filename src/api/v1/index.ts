import { OpenAPIHono } from '@hono/zod-openapi';

import flavours from './flavours';
import jobs from './jobs';

export default new OpenAPIHono().route('/flavours', flavours).route('/jobs', jobs);
