import { OpenAPIHono } from '@hono/zod-openapi';

import getJobs from './controllers/getJobs';
import getVizJobs from './controllers/getVizJobs';

export default new OpenAPIHono().route('/', getJobs).route('/viz', getVizJobs);
