import * as express from 'express';
import * as debug from 'debug';

let log = debug('paraboloid:server:API:errors');

export let errors = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  log('%o: %o', err.name, err.message);

  if (err.name === 'ValidationError') {
    log('%o is handled', err.name);
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors: any, key: any) {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }
  if (err.name === 'UnauthorizedError') {
    log('%o is handled', err.name);
    return res.status(401).send({ errors: { authorization: 'failed' } });
  }
  next(err);
};
