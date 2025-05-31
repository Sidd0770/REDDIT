import Profile from "../Models/Profile.js";
import Post from "../Models/Post.js";

export const getProfile=async (req,res)=>{
    try {
        const { username } = req.params;
        let { filter } = req.query; // Use 'let' to allow modification

        // Clean the filter string (remove potential quotes from URL like ?filter="postsCreated")
        if (filter) {
            filter = filter.replace(/"/g, '');
        }

        let profileQuery = Profile.findOne({ username: username });
        let fieldsToPopulate = []; // Array to store fields to populate
        let fieldsToSelect = { }; // Start with default base fields for selection

        // Determine which fields to populate and select based on the filter
        if (filter) {
            switch (filter) {
                case 'subJoined':
                    fieldsToPopulate.push('subJoined');
                    fieldsToSelect.subJoined = 1; // Include subJoined in the select projection
                    break;
                case 'subCreated':
                    fieldsToPopulate.push('subCreated');
                    fieldsToSelect.subCreated = 1;
                    break;
                case 'postsCreated':
                    fieldsToPopulate.push('postsCreated');
                    fieldsToSelect.postsCreated = 1;
                    break;
                case 'commentsCreated':
                    profileQuery = profileQuery.populate({
                        path:"commentsCreated",
                        match:{rootID:{$ne:null}}
                    });
                    fieldsToSelect.commentsCreated = 1;
                    break;
                case 'votes':
                    fieldsToPopulate.push('votes');
                    fieldsToSelect.votes = 1;
                    break;
                case 'recentPosts':
                    fieldsToPopulate.push('recentPosts');
                    fieldsToSelect.recentPosts = 1;
                    break;
                // If you want to return only the userID and username when filter='userID'
                case 'userID':
                    // fieldsToSelect already contains userID and username from defaultBaseFields
                    break;
                default:
                    // If filter is present but not recognized, act as if no filter was provided.
                    // Populate all default fields and do not apply a specific select.
                    // This will return the entire profile with all default populated fields.
                    fieldsToPopulate = [
                        'userID',
                        'subJoined',
                        'subCreated',
                        'postsCreated',
                        {
                        path: 'commentsCreated',
                        match: { rootID: { $ne: null } }
                        },
                        'votes',
                        'recentPosts',
                        // 'commentsCreated' if you want this populated by default too
                    ];
                    fieldsToSelect = {}; // Empty select means return all top-level fields by default Mongoose behavior
                    break;
            }
        }else {

            fieldsToPopulate = [
                'userID',
                'subJoined',
                'subCreated',
                'postsCreated',
                'commentsCreated',
                'votes',
                'recentPosts',
            ];
            fieldsToSelect = {}; 
        }

        // Apply populate calls
        fieldsToPopulate.forEach(field => {
            profileQuery = profileQuery.populate(field);
        });

        // Apply select projection if specific fields are chosen
        // Mongoose automatically includes _id unless you explicitly exclude it with _id: 0
        if (Object.keys(fieldsToSelect).length > 0) {
            profileQuery = profileQuery.select(fieldsToSelect);
        }

        const profile = await profileQuery.exec();

        // Profile not found
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found."
            });
        }

        // Convert the Mongoose document to a plain JavaScript object.
        // This is safe because .select() has already limited the fields returned by the DB.
        const dataToReturn = profile.toObject();

        // Optional: Add the filter back to the response for debugging/confirmation
        // if (filter) {
        //     dataToReturn.requestedFilter = filter;
        // }

        res.status(200).json({
            success: true,
            data: dataToReturn,
            message: "Profile fetched successfully."
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            error: 'Server error.',
            details: error.message // Keep this for development, consider removing/logging in production
        });
    }
  
}

//NEED TO FIND THE SUBREDDIT POST WHICH THE USER HAS JOINED
export const UserFeed=async(req,res)=>{
    try{
        const {username}=req.query;
        //get all the subreddit user has joined
        const SubredditJoined =await Profile.findOne(
            {username:username},
            {subJoined:1}
        )

        //now get all the post of these subreddits according to the timestamp
        const posts =await Post.find({
            subreddit:{
                $in:SubredditJoined.subJoined
            },
        })
        .sort({createdAt:-1});

        res.status(200).json({
            success:true,
            data:posts,
            message:"User Feed fetched successfully"
        });
        

    }catch(error){
        res.status(500).json({
            success: false,
            error: 'Server error.',
            details: error.message // Keep this for development, consider removing/logging in production
        });
    }
}










