import * as mongoose from 'mongoose';
import * as express from 'express';
import * as jwt from 'express-jwt';
import * as passport from 'passport';
import * as debug from 'debug';
import { UserModel, IUser } from '../../models';
import { Authorization } from './Authorization'
import { IRequestPayload } from './IRequestPayload'

let log = debug('paraboloid:server:API:users');
let router = express.Router();
let auth = new Authorization();

router.post('/', (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  log('>>> post /api/users/ with body %o', req.body);

  let user = new UserModel();
  if (req.body.user) {
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.bio = req.body.user.bio;
    user.image = req.body.user.image;
    user.setPassword(req.body.user.password);
  }
  user.save().then(function() {
    log("user %o successfully saved", user.username);
    return res.status(201).json({ user: user.toAuthJSON() });
  }).catch(next);

});

router.post('/login', (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {

  let bodyUser = req.body.user;

  if (!bodyUser) {
    log('No user found');
    return res.status(422).json({ errors: { user: "not found" } });
  }
  if (!bodyUser.email) {
    log('No email for user %o found', bodyUser.username);
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }
  if (!bodyUser.password) {
    log('No password for user %o found', bodyUser.username);
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate(
    'local', { session: false }, (err: any, user: any, info: any) => {

      if (err) {
        log('Error occured: %o', err);
        return next(err);
      }
      if (user) {
        log('User found: %o', user);
        return res.json({ user: user.toAuthJSON() });
      } else {
        log('Information: %o', info);
        return res.status(422).json({ errors: info });
      }
    })(req, res, next);
});

router.put('/user', auth.required, (
  req: IRequestPayload,
  res: express.Response,
  next: express.NextFunction
) => {
  log('>>> put /api/users/user with body %o/payload %o', req.body, req.payload);

  UserModel.findById(req.payload.id).then((user: IUser) => {

    let bodyUser = req.body.user;
    if (user) {
      log('User %o will be updated', user.username);
      if (bodyUser) {
        if (bodyUser.username) user.username = bodyUser.username;
        if (bodyUser.email) user.email = bodyUser.email;
        if (bodyUser.bio) user.bio = bodyUser.bio;
        if (bodyUser.image) user.image = bodyUser.image;
        if (bodyUser.password) user.setPassword(bodyUser.password.substr(100));
      }
      user.save().then(() => {
        log('User %o was updated', user.username);
        return res.status(200).json({ user: user.toAuthJSON() });
      }).catch(next);
    }
    else {
      log('User not valid');
      res.status(401).send({ errors: { user: 'not valid' } });
    }
  }).catch(next);
});

router.get('/user', auth.required, (
  req: IRequestPayload,
  res: express.Response,
  next: express.NextFunction
) => {
  log('>>> get /api/users/user with payload %o', req.payload);

  UserModel.findById(req.payload.id).then((user: IUser) => {
    if (user) {
      log('User %o was read', user.username);
      return res.status(200).json({ user: user.toAuthJSON() });
    }
    else {
      log('User not valid');
      res.status(401).send({ errors: { user: 'not valid' } });
    }
  }).catch(next);
});

router.delete('/user', auth.required, (
  req: IRequestPayload,
  res: express.Response,
  next: express.NextFunction
) => {

  log('>>> delete /api/users/user with payload %o', req.payload);
  UserModel.findById(req.payload.id).then((user: IUser) => {
    if (user) {
      log('User %o will be deleted', user.username);
      user.remove().then(() => {
        log('User %o was deleted', user.username);
        return res.sendStatus(204);
      }).catch(next);
    }
    else {
      log('User not valid');
      res.status(401).send({ errors: { user: 'not valid' } });
    }
  }).catch(next);

});

export { router as users };
