import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import cookiesParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './Router/user.js';
import postsRouter from './Router/posts.js';
import commentsRouter from './Router/comments.js';
import ProfileRouter from './Router/Profile.js';
import SubredditRouter from './Router/subreddit.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookiesParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

//mounting the router
app.use('/api/v1/auth',userRouter);
app.use('/api/v1',postsRouter);
app.use('/api/v1/comments',commentsRouter);
app.use('/api/v1/profile',ProfileRouter);
app.use('/api/v1/subreddit',SubredditRouter);

const PORT =process.env.PORT || 5000;

connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

app.get('/',(req,res)=>{
    res.send('HELLO BROTHER FROM EXPRESS');
})

