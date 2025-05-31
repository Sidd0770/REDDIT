import Router from 'express';
import {getPosts,getpostID,createPost,changeVotes,IncreasePostViewCount} from '../Controller/Posts.js';
import { verifyToken } from '../middleware/auth.js';

const router=Router();

router.get('/getPosts',getPosts);
router.get('/getPost/:id',getpostID);
router.post('/createPost',createPost);
router.put('/changeVotes/:id',changeVotes);
router.put('/IncreasePostViewCount/:id',verifyToken,IncreasePostViewCount);

export default router;