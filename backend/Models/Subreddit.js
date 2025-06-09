import mongoose from "mongoose";

const subredditSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    members:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    },
    Posts:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Post',
        default:[]
    },
    createdBy:{
        type:String,
        ref:'User',
        required:true
    },
    Moderators:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    }
},
{
    timestamps:true
});

const Subreddit =mongoose.model('Subreddit',subredditSchema);
export default Subreddit;




