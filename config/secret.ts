import * as debug from 'debug';
let log = debug('paraboloid:server:session');

export const secret = process.env.SECRET || 'secret';
log('Secret %o', secret);
