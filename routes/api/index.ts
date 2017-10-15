import * as express from 'express';
import * as debug from 'debug';
import { users } from './users';
import { articles } from './articles';
import { tags } from './tags';

let log = debug('paraboloid:server:API');
let api = express.Router();

api.use('/users', users);
api.use('/articles', articles);
api.use('/tags', tags);

api.use(function(
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (err.name === 'ValidationError') {
    log('%o: %o', err.name, err.message);
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors: any, key: any) {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }
  else next(err);
});

export { api as api };
