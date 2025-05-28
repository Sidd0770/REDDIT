import Post from "../Models/Post.js";
import Profile from "../Models/Profile.js";
import Subreddit from "../Models/Subreddit.js";

export const getPosts = async (req, res) => {
    try {
        const data=await Post.find({
            rooID:null,
            parentID:null
        });
        res.status(200).json({
            success:true,
            data:data
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error while fetching posts"
        })
    }
}

export const getpostID = async (req, res) => {
    try {
        const data=await Post.findById(req.params.id);
        res.status(200).json({
            success:true,
            data:data
        })
    }
     catch (error) {
        res.status(500).json({
            success:false,
            message:"Error while fetching posts"
        })
    } 
}

export const createPost =async(req,res)=>{
    try {
        const {author,title,desc,image,votes,rootID,parentID,subreddit}=req.body;

        const newPost =await Post.create({
            author,
            title,
            subreddit,
            desc,
            image,
            votes,
            rootID,
            parentID,
        });
        
        //update the profile of the user who created the post
        if(rootID===null && parentID===null){
            await Profile.findOneAndUpdate(
            {username:author},
            {
                $push:{
                    postsCreated:newPost._id,
                    recentPosts:{
                        $each:[newPost._id],
                        $slice:-10
                    }  
                },
                $inc:{PostKarma:1}              
            },    

            {new: true, upsert: true}
            )

        }

        //Update the profile of the User but it is comments
        await Profile.findOneAndUpdate(
            {username:author},
            {
                $push:{
                    commentsCreated:newPost._id,
                    recentPosts:{
                        $each:[newPost._id],
                        $slice:-10
                    }  
                },
                $inc:{PostKarma:1}              
            },    

            {new: true, upsert: true}
        )


        //Update the subreddit with the post
        await Subreddit.findOneAndUpdate(
            {name:subreddit},
            {
                $push:{
                    Posts:newPost._id
                }
            },
            {new:true,upsert:true}
        )

        res.status(200).json({
            success:true,
            data:newPost,
            message:"Post created successfully"
        });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while creating post"
        })
    }
}

export const changeVotes =async(req,res)=>{
    try {
       const response=await Post.findByIdAndUpdate(req.params.id,
        {votes:req.body.votes},
        {new:true});
       
       res.status(200).json({
            success:true,
            data:response,
            message:"Post Upvoted successfully"
       })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while creating post"
        })
    }
}

