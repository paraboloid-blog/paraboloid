import * as express from 'express';
import { IArticle, ArticleModel } from '../../models';

let router = express.Router();

router.get('/', function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction) {

  ArticleModel.find().distinct('tagList').then((tags: [IArticle]) => {
    return res.json({ tags: tags });
  }).catch(next);
});

export { router as tags };
