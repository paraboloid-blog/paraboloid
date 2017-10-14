import * as debug from 'debug';
let log = debug('paraboloid:server:address');

export const ip =
  process.env.IP ||
  process.env.OPENSHIFT_NODEJS_IP ||
  '0.0.0.0';
log('ip %o', ip);

export const port = parseInt(
  process.env.PORT ||
  process.env.OPENSHIFT_NODEJS_PORT ||
  '8080');
log('port %o', port);
