import Router from 'express';
import {getPosts,getpostID,createPost,IncreasePostViewCount,
    getTrendingPosts,deletePost ,upvotePost,downvotePost
} from '../Controller/Posts.js';
//middleware
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import { uploadFileToCloudinary } from '../middleware/uploadFileToCloudinary.js';

const router=Router();

router.get('/getPosts',getPosts);
router.get('/getPost/:id',verifyToken,getpostID);
router.post('/createPost',verifyToken,upload.single('postImage'),uploadFileToCloudinary,createPost);
router.put('/IncreasePostViewCount/:id',verifyToken,IncreasePostViewCount);
router.get('/TrendingPosts',getTrendingPosts);
router.put('/deletePost/:id',deletePost);
router.put('/downvotePost/:id',verifyToken,downvotePost);
router.put('/upvotePost/:id',verifyToken,upvotePost);


export default router;