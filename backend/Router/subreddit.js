import Router from 'express'
import {createSubreddit,joinSubreddit} from '../Controller/Subreddit.js'

const router =Router();

router.post('/createSubreddit',createSubreddit);
router.put('/joinSubreddit',joinSubreddit);

export default router;