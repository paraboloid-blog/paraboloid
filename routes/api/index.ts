import * as express from 'express';
import { users } from './users';
import { profiles } from './profiles';
import { articles } from './articles';
import { tags } from './tags';

let router = express.Router();

router.get('/api', function(
  req: express.Request,
  res: express.Response) {
    res.json({ path: req.originalUrl });
});

router.use('/', users);
router.use('/profiles', profiles);
router.use('/articles', articles);
router.use('/tags', tags);

export { router as api };
