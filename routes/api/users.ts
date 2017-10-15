import * as mongoose from 'mongoose';
import * as express from 'express';
import * as passport from 'passport';
import * as debug from 'debug';
import { auth } from './auth';
import { UserModel, IUser } from '../../models';

let log = debug('paraboloid:server:API:users');
let router = express.Router();

router.param('user', (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  username: any
) => {
  UserModel.findOne({ username: username }).then((user: IUser) => {
    if (user) {
      log('Parameter "user": %o', username);
      req.user = user;
      next();
    }
    else {
      log('User not found');
      res.status(404);
      next(new Error('User not Found'));
    }
  }).catch(next);
});

router.post('/', (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  log('>>> post /api/users/ with %o', req.body);
  let user = new UserModel();
  user.username = req.body.username;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save().then(function() {
    log("user %o successfully saved", user.username);
    return res.status(201).json({ user: user.toAuthJSON() });
  }).catch(next);
});

router.post('/login', (
  req: express.Request,
  res: express.Response
) => {
  res.status(200);
  res.json({ path: req.originalUrl });
});

router.put('/:user', auth.required, (
  req: express.Request,
  res: express.Response
) => {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      user: req.params.user
    });
});

router.get('/:user', auth.required, (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      user: req.params.user
    });
});

router.delete('/:user', (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  return req.user.remove().then(() => {
    return res.sendStatus(204);
  });
});

export { router as users };
