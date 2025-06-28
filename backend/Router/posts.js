import Router from 'express';
import {getPosts,getpostID,createPost,changeVotes,IncreasePostViewCount,
    getTrendingPosts,deletePost
} from '../Controller/Posts.js';
//middleware
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import { uploadFileToCloudinary } from '../middleware/uploadFileToCloudinary.js';

const router=Router();

router.get('/getPosts',getPosts);
router.get('/getPost/:id',getpostID,getpostID);
router.post('/createPost',verifyToken,upload.single('postImage'),uploadFileToCloudinary,createPost);
router.put('/changeVotes/:id',changeVotes);
router.put('/IncreasePostViewCount/:id',verifyToken,IncreasePostViewCount);
router.get('/TrendingPosts',getTrendingPosts);
router.put('/deletePost/:id',deletePost);

export default router;