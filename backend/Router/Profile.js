import Router from 'express';
import {getProfile,UserFeed,getSubredditName}  from '../Controller/Profile.js';
import {verifyToken} from '../middleware/auth.js';

const router = Router();

router.get('/getProfile/:username', getProfile);
router.get('/UserFeed',UserFeed);
router.get('/getSubredditName',verifyToken,getSubredditName);

export default router;