import { OpenAPIHono } from '@hono/zod-openapi';

import cancelJob from './controllers/cancelJob';
import getVEM2Job from './controllers/getVEM2Job';
import getVEM2Jobs from './controllers/getVEM2Jobs';

export default new OpenAPIHono()
   .route('/:id', getVEM2Job)
   .route('/:id', cancelJob)
   .route('/', getVEM2Jobs);
