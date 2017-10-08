import * as express from 'express';
import { users } from './users';
import { articles } from './articles';
import { tags } from './tags';

let api = express.Router();

api.use('/users', users);
api.use('/articles', articles);
api.use('/tags', tags);

export { api as api };
