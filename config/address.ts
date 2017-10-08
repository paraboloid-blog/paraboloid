import * as debug from 'debug';
let log = debug('paraboloid:server:address');

let ip =
  process.env.IP ||
  process.env.OPENSHIFT_NODEJS_IP ||
  '0.0.0.0';
log('ip %o', ip);

let port = parseInt(
  process.env.PORT ||
  process.env.OPENSHIFT_NODEJS_PORT ||
  '8080');
log('port %o', port);

export { ip, port };
