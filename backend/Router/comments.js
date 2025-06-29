import Router from 'express';
import {getComments,searchComments,createPost} from '../Controller/Comments.js';
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import { uploadFileToCloudinary } from '../middleware/uploadFileToCloudinary.js';
const router = Router();
// Route to get comments for a post
router.get('/getComments/:postId', getComments);       
router.get('/searchComments', searchComments);
router.post('/createComment',verifyToken,upload.single('postImage'),uploadFileToCloudinary,createPost);

export default router;