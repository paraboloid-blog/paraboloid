import * as express from 'express';
import * as jwt from 'express-jwt';
import * as debug from 'debug';
import * as config from '../../config';

let log = debug('paraboloid:server:API:auth');

class Authorization {

  private getTokenFromHeader(req: express.Request) {

    log("authorization header: %o", req.headers.authorization);
    if (req.headers.authorization) {
      let auth: string = req.headers.authorization.toString();
      if (auth.split(' ')[0] === 'Token' || auth.split(' ')[0] === 'Bearer')
        return auth.split(' ')[1];
    }
    return null;
  }

  get required(): jwt.RequestHandler {
    return jwt({
      secret: config.secret,
      userProperty: 'payload',
      getToken: this.getTokenFromHeader
    });
  }

  get optional(): jwt.RequestHandler {
    return jwt({
      secret: config.secret,
      userProperty: 'payload',
      credentialsRequired: false,
      getToken: this.getTokenFromHeader
    });
  }
};

let auth = new Authorization();

export { auth };
