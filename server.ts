import * as express from 'express';
import * as expressSession from 'express-session';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import * as passport from 'passport';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import { api } from './routes';
import { mongoURL } from './config/db';
import { ip, port } from './config/address';
// require('./models/User');
// require('./models/Article');
// require('./models/Comment');
// require('./config/passport');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({
  secret: 'paraboloid',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

mongoose.connect(mongoURL);

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  mongoose.set('debug', true);
}

app.use(api);

app.use(function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {
  res.sendStatus(404);
});

app.use(function(
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {
  res.sendStatus(err.status || 500);
});

let server = app.listen(port, ip, function() {
  console.log(
    'Listening on ' +
    server.address().address + ':' + server.address().port);
});
