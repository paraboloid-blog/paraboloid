let ip =
  process.env.IP ||
  process.env.OPENSHIFT_NODEJS_IP ||
  '0.0.0.0';
  
let port = parseInt(
  process.env.PORT ||
  process.env.OPENSHIFT_NODEJS_PORT ||
  '8080');

export { ip, port };
