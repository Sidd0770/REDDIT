import Profile from "../Models/Profile.js";

export const getProfile=async (req,res)=>{
    try{
    
        const id =req.params.id;
        console.log("Profile ID:", id);
        let profileQuery=Profile.findById(id);
        const {filter}=req.query;
        const defaultPopulateFields = [
            'userID',
            'subJoined',
            'subCreated',  
            'postsCreated',
            'commentsCreated',
            'votes',
            'recentPosts',
        ];

        if( filter ){
            switch(filter){

                case 'subJoined':
                    profileQuery=profileQuery.populate('subJoined');
                    break;
                case 'subCreated':
                    profileQuery= profileQuery.populate('subCreated');
                    break;
                case 'postsCreated':
                    profileQuery= profileQuery.populate('postsCreated');
                    break;
                case 'commentsCreated':
                    profileQuery= profileQuery.populate('commentsCreated');
                    break;
                case 'votes':
                    profileQuery=profileQuery.populate('votes');
                    break;
                case 'recentPosts':
                    profileQuery=profileQuery.populate('recentPosts');
                    break;

                default:
                    profileQuery=profileQuery.populate(defaultPopulateFields);
                    break;
            }
        }else{
            profileQuery=profileQuery.populate(defaultPopulateFields);
        }

        const profile=await profileQuery.exec();
        //profile not found
        if (!profile) {
            return res.status(400).json({
                success: false,
                message: "Profile not found"
            });
        }
        const dataToReturn= profile.toObject();

        if(filter){
            dataToReturn.filter=filter;
        }

        if (filter) {
            switch (filter) {          
                case 'subJoined':
                    // If 'subJoined' was requested, return only that part of the profile
                    dataToReturn = {
                        _id: profile._id, // Always include the profile ID
                        userID: profile.userID, // Often useful to include the owner's ID
                        subJoined: profile.subJoined
                    };
                    break;
                case 'subCreated':
                    // If 'subCreated' was requested, return only that part of the profile
                    dataToReturn = {
                        _id: profile._id, // Always include the profile ID
                        userID: profile.userID, // Often useful to include the owner's ID
                        subCreated: profile.subCreated
                    };
                    break;
                case 'postsCreated':
                    // If 'postsCreated' was requested, return only that part of the profile
                    dataToReturn = {
                        _id: profile._id, // Always include the profile ID
                        userID: profile.userID, // Often useful to include the owner's ID
                        postsCreated: profile.postsCreated
                    };
                    break;
                case 'commentsCreated':
                    dataToReturn = {
                        _id: profile._id,
                        userID: profile.userID,
                        commentsCreated: profile.commentsCreated
                    };
                    break;
                case 'userID':
                    dataToReturn = {
                        _id: profile._id,
                        userID: profile.userID
                    };
                    break;
                case 'votes':
                    dataToReturn = {
                        _id: profile._id,
                        userID: profile.userID,
                        votes: profile.votes
                    };
                    break;
                case 'recentPosts':
                    dataToReturn = {
                        _id: profile._id,
                        userID: profile.userID,
                        recentPosts: profile.recentPosts
                    };
                    break;

                default:
                    break;
            }
        }

        res.status(200).json({
            success:true,
            data:dataToReturn,
            message:"Profile fetched successfully"
        })

    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
        })
    }   
}








