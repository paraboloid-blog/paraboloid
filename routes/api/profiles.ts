import * as express from 'express';
let router = express.Router();

router.post('/users', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {
    console.log('profiles');
});

export { router as profiles };
