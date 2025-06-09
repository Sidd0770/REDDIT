import Router from 'express';
import { getComments,searchComments} from '../Controller/Comments.js';

const router=Router();

router.get('/getComments/:postID',getComments);
// router.post('/createComment/:postID',createComment);
router.get('/searchComments',searchComments);

export default router;
