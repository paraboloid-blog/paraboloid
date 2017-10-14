import * as express from 'express';
import * as jwt from 'express-jwt';
import * as debug from 'debug';
import * as config from '../../config';

class Authorization {

  log = debug('paraboloid:Server:Authorization');

  private getTokenFromHeader(req: express.Request) {

    this.log("Authorization header: %o", req.headers.authorization);
    let auth: string = req.headers.authorization[0];

    if (auth.split(' ')[0] === 'Token' || auth.split(' ')[0] === 'Bearer') {
      let token = auth.split(' ')[1];
      this.log("Token %o", token);
      return token;
    }
    else return null;
  }

  get required(): jwt.RequestHandler {
    this.log("Authorization required");
    return jwt({
      secret: config.secret,
      userProperty: 'payload',
      getToken: this.getTokenFromHeader
    });
  }

  get optional(): jwt.RequestHandler {
    this.log("Authorization optional");
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
