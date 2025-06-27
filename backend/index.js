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
import cron from 'node-cron';
import {rebuildProfiles} from './TimlyRun/ReRun.js';

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

connectDB()
    .then(()=>{
        // Schedule the cron job
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        });
        cron.schedule('30 2 * * *', async () => { // 2:30 AM every day
            console.log(`[${new Date().toLocaleString()}] Running daily profile rebuild...`);
            try {
                await rebuildProfiles(); // Your core logic
                console.log(`[${new Date().toLocaleString()}] Daily profile rebuild completed successfully.`);
            } catch (error) {
                console.error(`[${new Date().toLocaleString()}] Error during daily profile rebuild:`, error);
                // Consider adding more advanced error logging (e.g., Sentry, Winston)
            }
        }, {
            timezone: "Asia/Kolkata" 
        });
        console.log('Daily profile rebuild scheduled for 02:30 AM IST.');

    })
    .catch(error => {
        console.error('Application failed to start due to database connection error:', error);
       
    });



app.get('/',(req,res)=>{
    res.send('HELLO BROTHER FROM EXPRESS');
})

