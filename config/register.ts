import * as debug from 'debug';
let log = debug('paraboloid:server:config:register');

export const register = process.env.REGISTER || false;
log('Registration allowed: %o', register);
