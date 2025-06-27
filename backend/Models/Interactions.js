import mongoose from "mongoose";

const InteractionSchema = new mongoose.Schema({
    userId:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User', 
        index:true 
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Post' 
    },
    type:{ 
        type:String,
        enum:['view','upvote','downvote','comment'] 
    },
    topics :{
        type: [String],     
    },  

},{timestamps:true});

const Interaction=mongoose.model('Interaction',InteractionSchema);
export default Interaction;
