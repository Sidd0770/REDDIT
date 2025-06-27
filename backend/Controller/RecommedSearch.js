import Interest from "../Models/Interest";
import Post from "../Models/Post";

export const getRecommendedSearches = async (req, res) => {
    try{
        const id=req.user ?req.user.id:null;
        const it = await Interest.findById(id).lean();
        if (!it) return res.json([]);// cold-start users

        // favourite topics –> newest posts
        const topLikes = Object.entries(it.likes)
                                .sort((a,b)=>b[1]-a[1])
                                .slice(0,3)
                                .map(([topic])=>topic);

        //   frequent –> unread posts
        const topFreq  = Object.entries(it.frequent ?? {})
                                .sort((a,b)=>b[1]-a[1])
                                .slice(0,3)
                                .map(([topic])=>topic);

        //  unexplored suggestions
        const explore  = (it.suggestions ?? []).slice(0,3);

        const posts = await Post.aggregate([
            { $match:{ topics:{ $in:[ ...topLikes, ...topFreq, ...explore ] } } },
            { $addFields:{ 
                score:{
                    $cond:[ { $in:[ '$topics', topLikes ] }, 3,
                    { $cond:[ { $in:[ '$topics', topFreq ] }, 2,
                        { $cond:[ { $in:[ '$topics', explore ] }, 1, 0 ] } ]
                    }]
            }}},
            { $sort:{ score:-1, createdAt:-1 } },
            { $limit:20 }
        ]);

        res.json(posts);

    }catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
        })
    }
}