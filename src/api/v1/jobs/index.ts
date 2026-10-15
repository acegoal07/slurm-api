import { OpenAPIHono } from '@hono/zod-openapi';

import cancelVEM2Job from './controllers/cancelVEM2Job';
import createVEM2Job from './controllers/createVEM2Job';
import getVEM2Job from './controllers/getVEM2Job';
import getVEM2Jobs from './controllers/getVEM2Jobs';

export default new OpenAPIHono()
   .route('/:id', cancelVEM2Job)
   .route('/:id', getVEM2Job)
   .route('/', createVEM2Job)
   .route('/', getVEM2Jobs);
