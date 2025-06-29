import Post from "../Models/Post.js";
import Profile from "../Models/Profile.js";
import Subreddit from "../Models/Subreddit.js";
import Interactions from "../Models/Interactions.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();    

const getCategory=async(title, desc)=>{
    const payload={ title, desc };
    const { data } = await axios.post(
        process.env.CLS_SVC_URL + '/classify',
        payload,
        { timeout: 3000 } 
    );

    const topicsRes=await axios.post(
        process.env.CLS_SVC_URL+'/topics',
        payload,
        { timeout: 3000 }
    )
    console.log("this is the data returned by HuggingFace ",[data.category, ...topicsRes.data.topics])
    return [data.category, ...topicsRes.data.topics];        
}

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
        const id = req.params.id;
        const data=await Post.findById(id);
        if(req.user){
            
            await Interactions.create({
                userId:req.user.id,
                postId:id,
                type:"view",
                topics:data.topics
            });
        }
        
        res.status(200).json({
            success:true,
            data:data
        })
    }
     catch (error) {
        console.error("Error in getpostID:", error);
        res.status(500).json({
            success:false,
            message:"Error while fetching posts"
        })
    } 
}

export const createPost =async(req,res)=>{
    try {
        // const author=req.user ?req.user.username : null;
        const author = req.user ? req.user.username : null;
        const {title,desc,votes,subreddit}=req.body;

        const rootID = (req.body.rootID === 'null' || !req.body.rootID) ? null : req.body.rootID;
        const parentID = (req.body.parentID === 'null' || !req.body.parentID) ? null : req.body.parentID;
        console.log(rootID,parentID);
        // console.log(req.body);
        const imageUrl=req.cloudinaryUrl ? req.cloudinaryUrl : null;
        console.log("Image URL",imageUrl);
        const imagePublicid= req.cloudinaryPublicId ? req.cloudinaryPublicId : null;
        
        //this calls the huggingface API to get the category of the post
        console.log("huggingfaceAPI called");
        const category =await getCategory(title,desc);
        

        const newPost =await Post.create({
            author,
            title,
            subreddit,
            image:imageUrl,
            imagePublicid:imagePublicid,
            desc,
            votes,
            rootID,
            parentID,
            topics:category,
        });

        //increases the interaction count for comments under the post
        if(req.user && rootID !== null){
            await Interactions.create({
                userId:req.user.id,
                postId:rootID,
                type:"view",
                topics:data.topics
            });
        }
        
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
        console.error("Error in createPost:", error);
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while creating post"
        })
    }
}

export const upvotePost =async (req,res)=>{
    try {
        const postId=req.params.id;
        await Post.findByIdAndUpdate(postId,{
            $inc:{votes:1},       
        })
        
        if(req.user){
            await Interactions.create({
                userId:req.user.id,
                postId:postId,
                type:"upvote"
            });
        }
    } catch (error) {
        console.log("Error in upvoting post",error);
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while upvoting post"
        })
    }
}

export const downvotePost =async (req,res)=>{
    try {
        const postId=req.params.id;
        await Post.findByIdAndUpdate(postId,{
            $inc:{votes:-1},       
        })
        //update the interactions collection
        if(req.user){
            await Interactions.create({
                userId:req.user.id,
                postId:postId,
                type:"downvote"
            });
        }
    } catch (error) {
        console.log("Error in downvoting post",error);
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while downvoting post"
        })
    }
}

export const IncreasePostViewCount = async(req,res)=>{
    try{
        const id =req.params.id;
        const userId=req.user? req.user.id : null;
        console.log("this is req.user",req.user);
        console.log("User ID",userId);

        let updateQuery={};

        // Check if userId is present in the request
        const checkAlreadyViewed= await Post.findOne({
            _id:id,
            viewedBy:{
                $in:[userId]
            }
        });
        
        if(!checkAlreadyViewed){
            if(userId){
                console.log("User ID is present");
                updateQuery={
                    $inc:{
                        view_count:1
                    },
                    $addToSet:{
                        viewedBy:userId
                    },
                    $set:{
                        lastViewedAt:new Date()
                    }
                }
            }else{
                updateQuery={
                    $inc:{
                        view_count:1
                    }
                }
            }

            //here update the post to the view count 
            const response =await Post.findByIdAndUpdate(
                id,
                updateQuery,
                {new:true, upsert:true}
            )
            
        }else{
            return res.status(401).json({
                success:false,
                message:"Post already viewed by the user"
            })
        }
        

        res.status(200).json({
            success:true,
            data:response,
            message:"Post view count increased successfully"
        })
        
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while increasing post view count"
        })
    }   
}

export const getTrendingPosts=async(req,res)=>{
    try{
        const posts =await Post.aggregate([
            {
                //findin the time last viewed at or created at
                $addFields:{
                    effectiveActivityTime:{
                        $cond:{
                            if:{$ne:["$lastViewedAt",null]},
                            then:"$lastViewedAt",
                            else:"$createdAt"
                        }
                    },
                    hoursSinceActivity:{
                        $divide:[
                            {$subtract:[new Date(),"$$ROOT.effectiveActivityTime"]},
                            3600000
                        ]
                    }      
                },
                //calculate the trending score
                $addFields:{
                    normalizeHours:{
                        $max:[1,"$hoursSinceActivity"]
                    },
                    trendingScore:{
                        $subtract:[
                            {$log10:{$add:[1,"$view_count"]}},
                            {$divide:["$normalizeHours",24]}
                        ]
                    }
                },
            },
            {
                $sort: {
                    trendingScore: -1
                }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    author: 1,
                    view_count: 1,
                    createdAt: 1,
                    lastViewedAt: 1,
                    subreddit: 1,
                    trendingScore: 1,
                    
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: posts
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error.',
            details: error.message // Keep this for development, consider removing/logging in production
        });
    }
}

export const deletePost =async (req,res)=>{
    try{
        const {id} =req.params;
        console.log("Post ID to delete",id);
        const post = await Post.findByIdAndUpdate(
            id,
            {desc :"[DELETED]"},
            
        );
        res.status(200).json({
            success:true,
            data:post,
            message:"Post deleted successfully"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while deleting post"
        })
    }
}