import * as mongoose from 'mongoose';
import * as express from 'express';
import * as passport from 'passport';
import * as debug from 'debug';
import { auth } from './auth';
import { UserModel } from '../../models';

let log = debug('paraboloid:server:API:users');
let router = express.Router();

router.post('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {

  log('>>> post /api/users/ with %o', req.body);
  let user = new UserModel();
  user.username = req.body.username;
  user.email = req.body.email;
  if (req.body.password) user.setPassword(req.body.password);
  user.save().then(function() {
    log("user %o successfully saved", user.username);
    return res.status(201).json({ user: user.toAuthJSON() });
  }).catch(next);
});

router.post('/login', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json({ path: req.originalUrl });
});

router.put('/:user', auth.required, function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      user: req.params.user
    });
});

router.get('/:user', auth.required, function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      user: req.params.user
    });
});

export { router as users };
