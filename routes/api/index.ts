import * as express from 'express';
import * as passport from 'passport';
import { users } from './users';
import { articles } from './articles';
import { tags } from './tags';
import { errors } from './errors';
import { strategy } from './strategy';

passport.use(strategy);

let api = express.Router();
api.use('/users', users);
api.use('/articles', articles);
api.use('/tags', tags);
api.use(errors);

export { api as api };
