import * as debug from 'debug';
import { Strategy } from 'passport-local';
import { UserModel } from '../../models';

let log = debug('paraboloid:server:API:strategy');

export let strategy = new Strategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, (email, password, done) => {

  log('Login with email %o and papssword %o', email, password);

  UserModel.findOne({ email: email }).then(function(user) {

    if (!user || !user.validPassword(password)) {
      log('Credentials are not valid');
      return done(null, false, { message: 'email or password is invalid' });
    }

    log('Valid credentials found');
    return done(null, user);

  }).catch(done);
});
