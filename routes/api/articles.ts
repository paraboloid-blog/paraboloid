import * as express from 'express';

let router = express.Router();

router.get('/', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      tag: req.query.tag,
      author: req.query.author,
      limit: req.query.limit,
      offset: req.query.offset
    });
});

router.post('/', function(
  req: express.Request,
  res: express.Response) {
  res.status(201);
  res.json(
    {
      path: req.originalUrl
    });
});

router.get('/:slug', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      slug: req.params.slug
    });
});

router.put('/:slug', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      slug: req.params.slug
    });
});

router.delete('/:slug', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      slug: req.params.slug
    });
});

router.post('/:slug/comments', function(
  req: express.Request,
  res: express.Response) {
  res.status(201);
  res.json(
    {
      path: req.originalUrl,
      slug: req.params.slug
    });
});

router.get('/:slug/comments', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      slug: req.params.slug
    });
});

router.delete('/:slug/comments/:id', function(
  req: express.Request,
  res: express.Response) {
  res.status(200);
  res.json(
    {
      path: req.originalUrl,
      slug: req.params.slug,
      id: req.params.id
    });
});

export { router as articles };
