import mongoose from "mongoose";

const PostSchema=new mongoose.Schema({
    author:{
        type:String,
        required:true,
    },
    subreddit:{
        type:String,
        unique:true,    
    },
    title:{
        type:String,
        
    },
    desc:{
        type:String,
        required:true
    }, 
    image:{
        type:String,
    },
    link:{
        type:String,
    },
    votes:{
        type:Number,
        default:0
    },
    rootID:{
        type:mongoose.Schema.Types.ObjectId,
    },
    parentID:{
        type:mongoose.Schema.Types.ObjectId,
    },
    view_count:{
        type:Number,
        default:0
    },
    viewedBy:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    },
    lastViewedAt:{
        type:Date,
        default:null,
        index:true
    }
  
},{timestamps:true});

const Post =mongoose.model('Post',PostSchema);
export default Post;