import * as debug from 'debug';
let log = debug('paraboloid:server:secret');

export const secret = process.env.SECRET || 'secret';
log('secret %o', secret);
