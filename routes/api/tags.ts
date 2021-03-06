import * as express from 'express';
import * as debug from 'debug';
import { IArticle, ArticleModel } from '../../models';

let log = debug('paraboloid:server:API:tags');

let router = express.Router();

router.get('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {

  log('>>> get /api/tags');

  ArticleModel.find().distinct('tagList')
    .then((tags: [IArticle]) => {
      log('Tags %o found', tags);
      return res.status(200).json({ tags: tags });
    })
    .catch((err: any) => {
      log('No tags available');
      return res.status(404).send({ errors: { tags: 'not found' } });
    });
});

export { router as tags };
