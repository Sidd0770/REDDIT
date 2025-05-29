import Router from 'express';
import {getProfile,UserFeed}  from '../Controller/Profile.js';

const router = Router();

router.get('/getProfile/:username', getProfile);
router.get('/UserFeed',UserFeed);

export default router;