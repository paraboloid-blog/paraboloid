import * as debug from 'debug';
let log = debug('paraboloid:server:mongo');

let mongoURL =
  process.env.OPENSHIFT_MONGODB_DB_URL ||
  process.env.MONGO_URL ||
  'mongodb://localhost/paraboloid';
log('original mongoURL %o', mongoURL);

if (mongoURL === undefined && process.env.DATABASE_SERVICE_NAME) {

  let mongoServiceName = process.env.DATABASE_SERVICE_NAME;
  if (mongoServiceName) mongoServiceName.toUpperCase();

  let mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
  let mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
  let mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
  let mongoUser = process.env[mongoServiceName + '_USER'];
  let mongoPassword = process.env[mongoServiceName + '_PASSWORD'];

  if (mongoHost && mongoPort && mongoDatabase) {

    mongoURL = 'mongodb://';

    if (mongoUser && mongoPassword)
      mongoURL += mongoUser + ':' + mongoPassword + '@';

    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  }
}
log('new mongoURL %o', mongoURL);

export { mongoURL };
