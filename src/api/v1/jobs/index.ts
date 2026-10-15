import { OpenAPIHono } from '@hono/zod-openapi';

import getJob from './controllers/getJob';
import getJobs from './controllers/getJobs';
import getVizJobs from './controllers/getVizJobs';

export default new OpenAPIHono()
   .route('/viz', getVizJobs)
   .route('/:id', getJob)
   .route('/', getJobs);
