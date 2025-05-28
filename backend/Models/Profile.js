import mongoose from "mongoose";

const profileSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    username:{
        type:String,
        ref:'User',
    },
    subJoined:{
        type:[String],
        default:[]
    },
    subCreated:{
        type:[String],
        default:[]
    },
    postsCreated:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Post',
        default:[]
    },
    commentsCreated:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Comment',
        default:[]
    },
    votes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Post',
        default:[]
    },
    recentPosts:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Post',
        default:[]
    },
    PostKarma:{
        type:Number,
        default:0
    },
    CommentKarma:{
        type:Number,
        deafult:0
    },
    follower:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    },

})

const Profile = mongoose.model('Profile',profileSchema);

export default Profile;