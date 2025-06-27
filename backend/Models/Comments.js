import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    Content:{
        type:String,        
    },
    author:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    parentID:{
        type:mongoose.Schema.Types.ObjectId,
    },
    

},{timestamps:true});

const Comment=mongoose.model('Comment',commentSchema);
export default Comment;