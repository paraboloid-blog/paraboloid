import * as express from 'express';

let router = express.Router();

router.get('/', function(
  req: express.Request,
  res: express.Response) {
    res.json({ path: req.originalUrl });
});

export { router as articles };
