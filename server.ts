import * as express from 'express';
import * as expressSession from 'express-session';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import * as passport from 'passport';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as debug from 'debug';
import { api } from './routes';
import { mongoURL } from './config/db';
import { ip, port } from './config/address';
// require('./models/User');
// require('./models/Article');
// require('./models/Comment');
// require('./config/passport');

let log = debug('paraboloid:server');

log('>>> express');
let app = express();

log('>>> bodyParser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

log('>>> expressSession');
app.use(expressSession({
  secret: 'paraboloid',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

log('>>> mongoose');
mongoose.createConnection(mongoURL);

log('>>> extra logging');
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  mongoose.set('debug', true);
}

log('>>> api routes');
app.use(api);

log('>>> dummy route');
app.use(function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {
  res.sendStatus(404);
});

log('>>> error handler');
app.use(function(
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {
  res.sendStatus(err.status || 500);
});

log('>>> listener');
let server = app.listen(port, ip, function() {
  console.log(
    'Listening on ' +
    server.address().address + ':' + server.address().port);
});
