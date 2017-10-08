import { api } from './api';

api.use('/api', api);

export { api as router };
