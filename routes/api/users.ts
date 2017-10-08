import * as express from 'express';

let router = express.Router();

router.post('/', function(
  req: express.Request,
  res: express.Response) {
  res.status(201);
  res.json({ path: req.originalUrl });
});

router.post('/login', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json({ path: req.originalUrl });
});

router.put('/:user', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      user: req.params.user
    });
});

router.get('/:user', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      user: req.params.user
    });
});

export { router as users };
