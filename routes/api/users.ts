import * as mongoose from 'mongoose';
import * as express from 'express';
import * as passport from 'passport';
import * as debug from 'debug';
import { auth } from './auth';
import { UserModel } from '../../models';

let log = debug('paraboloid:Server:API:Users');
let router = express.Router();
let User = mongoose.model('User');

router.post('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {

  log('>>> Post /api/users/ with %o', req.body);
  try {
    let user = new UserModel();
    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save().then(function() {
      log("User successfully saved")
      return res.status(201).json({ user: user.toAuthJSON() });
    }).catch(next);
  }
  catch (e) {
    res.status(422);
    next(e);
  }
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
