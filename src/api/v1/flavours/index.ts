import { OpenAPIHono } from '@hono/zod-openapi';

import getAllFlavours from './controllers/getAllFlavours';
import getFlavour from './controllers/getFlavour';

export default new OpenAPIHono().route('/:name', getFlavour).route('/', getAllFlavours);
