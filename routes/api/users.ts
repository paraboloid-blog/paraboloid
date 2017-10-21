import * as mongoose from 'mongoose';
import * as express from 'express';
import * as jwt from 'express-jwt';
import * as passport from 'passport';
import * as debug from 'debug';
import { UserModel } from '../../models';
import { IUser, Authorization, RequestPayload } from '../../typings'

let log = debug('paraboloid:server:API:users');
let router = express.Router();
let auth = new Authorization();

router.post('/', (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {

  log('>>> post /api/users/ with %o', req.body);

  let user = new UserModel();
  user.username = req.body.username;
  user.email = req.body.email;
  user.bio = req.body.bio;
  user.image = req.body.image;
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
  res.status(200).json({ path: req.originalUrl });
});

router.put('/user', auth.required, (
  req: express.Request,
  res: express.Response
) => {
  res.status(200).json(
    {
      path: req.originalUrl,
      user: req.params.user
    });
});

router.get('/user', auth.required, (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res.status(200).json(
    {
      path: req.originalUrl,
      user: req.params.user
    });
});

router.delete('/user', auth.required, (
  req: RequestPayload,
  res: express.Response,
  next: express.NextFunction
) => {

  UserModel.findOne({ username: req.payload.id }).then((user: IUser) => {
    if (user) {
      log('User %o will be deleted', user.username);
      user.remove().then(() => {
        log('User %o was deleted', user.username);
        return res.sendStatus(204);
      });
    }
    else {
      log('User not valid');
      res.status(401).send('User not valid');
    }
  }).catch(next);

});

export { router as users };
