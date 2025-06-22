import mongoose from 'mongoose';
import Subreddit from '../Models/Subreddit.js';
import Profile from '../Models/Profile.js';

export const createSubreddit =async (req,res)=>{
    try{
        const createdBy=req.user ?req.user.username : null;
        const {name,description,icon}=req.body;
        const newSubreddit =await Subreddit.create(
            { 
                name,
                description,
                icon,
                createdBy,
            }
        );

        // Update the profile of the user who created the subreddit
        await Profile.findOneAndUpdate(
            {username:createdBy},
            {
                subCreated:newSubreddit._id,    
            }
        )
        res.send({
            success:true,
            data:newSubreddit,
            message:"Subreddit created successfully"
        })

    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while creating subreddit"
        })
    }
}

export const joinSubreddit =async (req,res)=>{
    try{
        const id=req.user ?req.user.id:null;
        const {subreddit}=req.body;
      
        
        const response =await Subreddit.findOneAndUpdate(
            {name:subreddit},
            {
                $addToSet:{
                    members:id
                }
            }
        )
        console.log("Response from joining subreddit:", response);
        res.status(200).json({
            success:true,
            message:"Joined Subreddit Successfully"
        })

    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while joining subreddit"
        })
    }
}

export const checkMember =async (req,res)=>{
    try{
        const id=req.user? req.user.id : null;
        
        const {subreddit}=req.query;
        console.log("Checking membership for subreddit:", subreddit, "and user ID:", id);
        const foundSubreddit=await Subreddit.findOne(
            {name:subreddit},
            {members:1}
        );

        const userObjectId =new mongoose.Types.ObjectId(id);
        
        const isMember =foundSubreddit.members && Array.isArray(foundSubreddit.members)
                        ? foundSubreddit.members.some(member => member.equals(userObjectId))
                        : false;

        //update the subjoinde section of the user in profile Schema
        if(isMember){
            console.log("User is a member of the subreddit");
            await Profile.findOneAndUpdate(
                {userID:id},
                {
                    $addToSet:{
                        subJoined:subreddit
                    }
                }
            )
        }               
        res.status(200).json({
            sucess:true,
            isMember:isMember,
            message:isMember ? "User is a member of the subreddit" : "User is not a member of the subreddit"
        })

    }catch(e){
        res.status(500).json({
            success:false,
            error:e.message,
            message:"Error while checking member"
        })
    }
}

export const ModControls=async (req,res)=>{
    try{
        const id = req.user? req.user.id : null;
        const {subreddit}=req.query;
        const isModerator =await Subreddit.findOne({
                name:subreddit,
                Moderators:{
                    $in:[id]
                }}
        )
        res.status(200).json({
            success:true,
            isModerator:isModerator ? true : false,
            message:isModerator ? "User is a moderator of the subreddit" : "User is not a moderator of the subreddit"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Error while checking moderator status"
        })
    }
}
