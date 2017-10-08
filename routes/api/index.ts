import * as express from 'express';
let router = express.Router();

import { users } from './users';
import { profiles } from './profiles';
import { articles } from './articles';
import { tags } from './tags';

router.use('/', users);
router.use('/profiles', profiles);
router.use('/articles', articles);
router.use('/tags', tags);

export { router as api };
