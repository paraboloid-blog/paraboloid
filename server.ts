import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as debug from 'debug';
import * as config from './config';
import * as routes from './routes';

let log = debug('paraboloid:server');

log('>>> express');
let app = express();

log('>>> bodyParser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

log('>>> mongoose');
(<any>mongoose).Promise = global.Promise;
mongoose.connect(config.mongoURL, { useMongoClient: true });

log('>>> extra logging');
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  mongoose.set('debug', true);
}

log('>>> api routes');
app.use(routes.api);

log('>>> dummy route');
app.use(function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {
  res.status(404).send('Not Found');
});

log('>>> error handler');
app.use(function(
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  log('Error %o (%o): %o', res.statusCode, err.name, err.message);
  res.status(res.statusCode || 500).send({ errors: { message: err.message } });
});

log('>>> listener');
let server = app.listen(config.port, config.ip, function() {
  console.log(
    'Listening on ' +
    server.address().address + ':' + server.address().port);
});
