import Router from 'express'
import {createSubreddit,joinSubreddit,checkMember,ModControls} from '../Controller/Subreddit.js'
import { verifyToken } from '../middleware/auth.js';

const router =Router();

router.post('/createSubreddit',createSubreddit);
router.put('/joinSubreddit',verifyToken,joinSubreddit);
router.get('/checkMember',verifyToken,checkMember);
router.get('/ModControls',verifyToken,ModControls);

export default router;