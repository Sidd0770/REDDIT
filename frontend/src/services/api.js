const BASE_URL="http://localhost:3000/api/v1";

export const ENDPOINTS = {
    REGISTER_API:BASE_URL + "/auth/register",
    LOGIN_API:BASE_URL + "/auth/login",
    INIT_LOGIN_API:BASE_URL+"/auth/protected",
    VERIFY_OTP_API:BASE_URL+"/auth/verifyOTP",
    GOOGLE_LOGIN_API:BASE_URL + "/auth/googleLogin",
    GOOGLE_AUTH_API:BASE_URL + "/auth/googleAuth",
    
}

export const postsEndpoints = {
    GET_ALL_POSTS:BASE_URL+"/getPosts",
    GET_POST_BY_ID:BASE_URL+"/getpost/",
    CREATE_POST:BASE_URL+"/createPost",
    CHANGEVOTES:BASE_URL+"/changeVotes/",
    INCREASE_VIEW_COUNT:BASE_URL+"/IncreasePostViewCount/",
    TRENDING_POSTS:BASE_URL+"/TrendingPosts",
    DELETE_POST:BASE_URL+"/deletePost/",
    UPVOTE_POST:BASE_URL+"/upvotePost/",
    DOWNVOTE_POST:BASE_URL+"/downvotePost/"
    
}

export const commentEndPoints={
    GET_COMMENTS:BASE_URL+"/comments/getComments/",
    CREATE_COMMENT:BASE_URL+"/comments/createComment",
    SEARCH_COMMENTS:BASE_URL+"/comments/searchComments",
    
}
export const profileEndpoints={
    GET_PROFILE:BASE_URL+"/profile/getProfile/",
    USER_FEED:BASE_URL+"/profile/UserFeed",
    SUBREDDITS:BASE_URL+"/profile/getSubredditName"
    
}
export const subredditEndpoints={
    CREATE_SUBREDDIT:BASE_URL+"/subreddit/createSubreddit",
    JOIN_SUBREDDIT:BASE_URL+"/subreddit/joinSubreddit",
    CHECK_MEMBER:BASE_URL+"/subreddit/checkMember",
    MOD_CONTROLS:BASE_URL+"/subreddit/ModControls"
}
