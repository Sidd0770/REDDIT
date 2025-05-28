import Router from 'express';
import {getPosts,getpostID,createPost,changeVotes} from '../Controller/Posts.js';

const router=Router();

router.get('/getPosts',getPosts);
router.get('/getPost/:id',getpostID);
router.post('/createPost',createPost);
router.put('/changeVotes/:id',changeVotes);

export default router;