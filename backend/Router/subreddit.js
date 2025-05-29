import Router from 'express'
import {createSubreddit,joinSubreddit,checkMember} from '../Controller/Subreddit.js'

const router =Router();

router.post('/createSubreddit',createSubreddit);
router.put('/joinSubreddit',joinSubreddit);
router.get('/checkMember',checkMember);

export default router;