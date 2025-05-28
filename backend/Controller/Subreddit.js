import Subreddit from '../Models/Subreddit.js';
import Profile from '../Models/Profile.js';

export const createSubreddit =async (req,res)=>{
    try{
        const {name,description,icon,createdBy}=req.body;
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
        const {id,subreddit}=req.body;
        
        await Subreddit.findByIdAndUpdate(
            {name:subreddit},
            {
                $addToSet:{members:id}
            }
        )
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
