import * as express from 'express';
import * as debug from 'debug';
import { Authorization } from './Authorization'
import { IRequestExt } from './IRequestExt'
import { UserModel, IUser, ArticleModel, IArticle } from '../../models';

let log = debug('paraboloid:server:API:articles');
let router = express.Router();
let auth = new Authorization();

router.param('slug', (
  req: IRequestExt,
  res: express.Response,
  next: express.NextFunction,
  slug: string) => {

  log('>>> parameter slug %o determined', slug);

  ArticleModel
    .findOne({ slug: slug })
    .populate('author')
    .then((article) => {

      if (article) {
        log('Article %o found', slug);
        req.article = article;
        return next();
      }
      else {
        log('Article %o not found', slug);
        return res.status(404).send({ errors: { article: 'not valid' } });
      }
    }).catch(next);
});

router.get('/', (
  req: express.Request,
  res: express.Response) => {
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

router.post('/', auth.verify, (
  req: IRequestExt,
  res: express.Response,
  next: express.NextFunction) => {

  log('>>> post /api/articles with body %o/payload %o', req.body, req.payload);

  UserModel.findById(req.payload.id).then((user: IUser) => {
    if (user) {
      let article = new ArticleModel(req.body.article);
      article.author = user;
      log('Article %o will be created', article.slug);

      article.save().then(() => {
        let json = article.getArticleJSON();
        log('Article was created: %o', json);
        return res.status(201).json({ article: json })
      }).catch(next);;
    }
    else {
      log('User not valid');
      return res.status(401).send({ errors: { user: 'not valid' } });
    }
  }).catch(next);
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

router.delete('/:slug', auth.verify, (
  req: IRequestExt,
  res: express.Response,
  next: express.NextFunction) => {

  log('>>> delete /api/articles/:slug with payload %o', req.payload);

  UserModel.findById(req.payload.id).then((user: IUser) => {
    if (user) {
      if (req.article.author._id.toString() === req.payload.id.toString()) {
        req.article.remove().then(() => {
          log('Article %o was deleted', req.article.slug);
          res.sendStatus(204);
        });
      } else {
        log('Article %o may not be deleted by %o', req.article.slug, user.username);
        return res.status(403).send({
          errors: { article: 'may not be deleted' }
        });
      }
    }
    else {
      log('User not valid');
      return res.status(401).send({ errors: { user: 'not valid' } });
    }
  }).catch(next);
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
