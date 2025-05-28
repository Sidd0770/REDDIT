import Router from 'express';
import {getProfile}  from '../Controller/Profile.js';

const router = Router();

router.get('/getProfile/:id', getProfile);

export default router;