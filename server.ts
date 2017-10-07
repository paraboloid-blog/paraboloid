import * as express from 'express';
import * as expressSession from 'express-session';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as path from 'path';
import * as passport from 'passport';
import * as morgan from 'morgan';
import { ExprError as ExprError } from './helpers/errors';
import { router as router } from './routes';

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({
  secret: 'conduit',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

app.use(router);
app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
  next(new ExprError('Not Found', 404));
});
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(err.status || 500);
  res.json({ 'error': { message: err.message, stack: err.stack } });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + server.address().port);
});
