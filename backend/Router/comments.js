import Router from 'express';
import {getComments,searchComments} from '../Controller/Comments.js';
import { verifyToken } from '../middleware/auth.js';
const router = Router();
// Route to get comments for a post
router.get('/getComments/:postId', getComments);       
router.get('/searchComments', searchComments);

export default router;