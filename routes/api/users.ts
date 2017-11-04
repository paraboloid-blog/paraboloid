import * as mongoose from 'mongoose';
import * as express from 'express';
import * as passport from 'passport';
import * as debug from 'debug';
import * as config from '../../config';
import { UserModel, IUser } from '../../models';
import { Authorization } from './Authorization'
import { IRequestExt } from './IRequestExt'

let log = debug('paraboloid:server:API:users');
let router = express.Router();
let auth = new Authorization();

router.post('/', (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  log('>>> post /api/users/ with body %o', req.body);

  if (!config.register) {
    log('Registration is not allowed');
    return res.status(405).send({ errors: { registration: 'not allowed' } });
  }

  let user = new UserModel(req.body.user);
  if (req.body.user.password) user.setPassword(req.body.user.password);

  user.save()
    .then(() => {
      let json = user.getAuthJSON();
      log('User successfully saved: %o', json);
      return res.status(201).json({ user: json });
    })
    .catch(next);
});

router.post('/login', (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {

  log('>>> post /api/users/login with body %o', req.body);

  let bodyUser = req.body.user;

  if (!bodyUser) {
    log('No user found');
    return res.status(422).json({ errors: { user: 'not found' } });
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
        let json = user.getAuthJSON()
        log('User found: %o', json);
        return res.json({ user: json });
      } else {
        log('Information: %o', info);
        return res.status(422).json({ errors: info });
      }
    })(req, res, next);
});

router.put('/user', auth.required, (
  req: IRequestExt,
  res: express.Response,
  next: express.NextFunction
) => {
  log('>>> put /api/users/user with body %o/payload %o', req.body, req.payload);

  UserModel.findById(req.payload.id)
    .then((user: IUser) => {

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
        user.save()
          .then(() => {
            let json = user.getAuthJSON();
            log('User was updated: %o', json);
            return res.status(200).json({ user: json });
          })
          .catch(next);
      }
      else {
        log('User not valid');
        return res.status(401).send({ errors: { user: 'not valid' } });
      }
    })
    .catch((err: any) => {
      log('User not valid');
      return res.status(401).send({ errors: { user: 'not valid' } });
    });
});

router.get('/user', auth.required, (
  req: IRequestExt,
  res: express.Response,
  next: express.NextFunction
) => {
  log('>>> get /api/users/user with payload %o', req.payload);

  UserModel.findById(req.payload.id)
    .then((user: IUser) => {
      if (user) {
        let json = user.getAuthJSON();
        log('User was read: %o', json);
        return res.status(200).json({ user: json });
      }
      else {
        log('User not valid');
        return res.status(401).send({ errors: { user: 'not valid' } });
      }
    })
    .catch((err: any) => {
      log('User not valid');
      return res.status(401).send({ errors: { user: 'not valid' } });
    });
});

router.delete('/user', auth.required, (
  req: IRequestExt,
  res: express.Response,
  next: express.NextFunction
) => {

  log('>>> delete /api/users/user with payload %o', req.payload);

  UserModel.findById(req.payload.id)
    .then((user: IUser) => {
      if (user) {
        log('User %o will be deleted', user.username);
        user.remove().then(() => {
          log('User %o was deleted', user.username);
          return res.sendStatus(204);
        }).catch(next);
      }
      else {
        log('User not valid');
        return res.status(401).send({ errors: { user: 'not valid' } });
      }
    })
    .catch((err: any) => {
      log('User not valid');
      return res.status(401).send({ errors: { user: 'not valid' } });
    });
});

export { router as users };
