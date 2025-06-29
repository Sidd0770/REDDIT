import Post from "../Models/Post.js";
import Interactions from "../Models/Interactions.js";
import Profile from "../Models/Profile.js";
import Subreddit from "../Models/Subreddit.js";

//get comments from the backend
export const getComments=async(req,res)=>{
    try{
        const rootID =req.params.postId;
        const parentID =req.query.parentID; ; 
        
        const commments=await Post.find({
            rootID:rootID,
            parentID:parentID           
        });

        res.status(200).json({
            success:true,
            data:commments,
            message:"comments fetched succesfully"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
        })
    }
}

export const createPost =async(req,res)=>{
    try {
        
        const author = req.user ? req.user.username : null;
        const {title,desc,votes,subreddit}=req.body;
        console.log("this is the comment data ",req.body);

        const rootID = (req.body.rootID === 'null' || !req.body.rootID) ? null : req.body.rootID;
        const parentID = (req.body.parentID === 'null' || !req.body.parentID) ? null : req.body.parentID;
        console.log(rootID,parentID);
        // console.log(req.body);
        const imageUrl=req.cloudinaryUrl ? req.cloudinaryUrl : null;
        console.log("Image URL",imageUrl);
        const imagePublicid= req.cloudinaryPublicId ? req.cloudinaryPublicId : null;
        
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
            
        });
        console.log("New Post Created",newPost);

        //increases the interaction count for comments under the post
        if(req.user ){
            await Interactions.create({
                userId:req.user.id,
                postId:rootID,
                type:"view",
                
            });
        }
        console.log("Interactions created for the post");

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
        console.log("Profile updated with the post");

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
        console.log("Profile updated with the post");

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
        console.log("Subreddit updated with the post");

        res.status(200).json({
            success:true,
            data:newPost,
            message:"Post created successfully"
        });

        console.log("Comment created Successfully");
    } 
    catch (error) {
        // console.error("Error in createPost:", error);
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while creating post"
        })
    }
}

export const searchComments=async(req,res)=>{
    try{
        const text=req.query.search;
        console.log(text);
        const comments=await Post.find({
            $or:[
                {title: { $regex: '.*' + text + '.*', $options: 'i' } },
                {desc:{ $regex:'.*'+text+'.*', $options:'i' }},
            ]     
        })
        res.status(200).json({
            success:true,
            data:comments,
            message:"comments fetched succesfully"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
        })
    }
}
