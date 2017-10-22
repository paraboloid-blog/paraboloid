import * as debug from 'debug';
import { Strategy } from 'passport-local';
import { IUser, UserModel } from '../../models';

let log = debug('paraboloid:server:API:strategy');

export let strategy = new Strategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, (email, password, done) => {

  log('Login with email %o and password %o', email, password);

  UserModel.findOne({ email: email }).then((user: IUser) => {

    if (!user || !user.validPassword(password)) {
      log('Credentials are not valid');
      return done(null, false, { message: 'email or password is invalid' });
    }

    log('Valid credentials for user %o found', user.username);
    return done(null, user);

  }).catch(done);
});
