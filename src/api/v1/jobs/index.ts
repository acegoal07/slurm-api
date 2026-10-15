import { OpenAPIHono } from '@hono/zod-openapi';

import cancelJob from './controllers/cancelJob';
import getJob from './controllers/getJob';
import getJobs from './controllers/getJobs';
import getVEM2Jobs from './controllers/getVEM2Jobs';

export default new OpenAPIHono()
   .route('/vem2', getVEM2Jobs)
   .route('/:id', getJob)
   .route('/:id', cancelJob)
   .route('/', getJobs);
