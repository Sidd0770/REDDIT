import Post from "../Models/Post.js";

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

//Create Comment in the backend
// export const createComment=async(req,res)=>{
//     try{
//         const {text,author,postId,parentId}=req.body;
//         const comment=await Comment.create({
//             text,
//             author,
//             postId,
//             parentId,
//         });

//         await Profile.findOneAndUpdate(
//             {username:author},
//             {
//                 $push:{
//                     commentsCreated:comment._id,

//                 },
//                 $inc:{
//                     CommentKarma:1
//                 },
                
//             },
//             { new: true, upsert: true }
//         )

//         res.status(200).json({
//             success:true,
//             data:comment,
//             message:"comment created succesfully"
//         })
//     }catch(error){
//         res.status(500).json({
//             success:false,
//             error:error.message,

//         })
//     }
// }

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
