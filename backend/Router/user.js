import express from 'express';
import {verifyToken} from '../middleware/auth.js';

const router=express.Router();

import  {registerUser,loginUser} from '../Controller/Auth.js';

router.post('/register', registerUser);
router.post('/login',loginUser);

router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({
      success: true,
      message: 'You have access to this protected route!',
      // The decoded user information from the JWT
      user: req.user, 
    });
});


//export router to use in index.js
export default router;

