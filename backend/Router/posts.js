import Router from 'express';
import {getPosts,getpostID,createPost,changeVotes,IncreasePostViewCount,
    getTrendingPosts,deletePost
} from '../Controller/Posts.js';
import { verifyToken } from '../middleware/auth.js';

const router=Router();

router.get('/getPosts',getPosts);
router.get('/getPost/:id',getpostID);
router.post('/createPost',createPost);
router.put('/changeVotes/:id',changeVotes);
router.put('/IncreasePostViewCount/:id',verifyToken,IncreasePostViewCount);
router.get('/TrendingPosts',getTrendingPosts);
router.put('/deletePost/:id',deletePost);

export default router;