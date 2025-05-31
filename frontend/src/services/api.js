const BASE_URL="http://localhost:3000/api/v1";

export const ENDPOINTS = {
    REGISTER_API:BASE_URL + "/auth/register",
    LOGIN_API:BASE_URL + "/auth/login",
    INIT_LOGIN_API:BASE_URL+"/auth/protected"
    
}

export const postsEndpoints = {
    GET_ALL_POSTS:BASE_URL+"/getPosts",
    GET_POST_BY_ID:BASE_URL+"/getpost/",
    CREATE_POST:BASE_URL+"/createPost",
    CHANGEVOTES:BASE_URL+"/changeVotes/",
    INCREASE_VIEW_COUNT:BASE_URL+"/IncreasePostViewCount/"

}

export const commentEndPoints={
    GET_COMMENTS:BASE_URL+"/comments/getComments/",
    CREATE_COMMENT:BASE_URL+"/comments/createComment",
    SEARCH_COMMENTS:BASE_URL+"/comments/searchComments",
    
}
export const profileEndpoints={
    GET_PROFILE:BASE_URL+"/profile/getProfile/",
    USER_FEED:BASE_URL+"/profile/UserFeed"
    
}
export const subredditEndpoints={
    CREATE_SUBREDDIT:BASE_URL+"/subreddit/createSubreddit",
    JOIN_SUBREDDIT:BASE_URL+"/subreddit/joinSubreddit",
    CHECK_MEMBER:BASE_URL+"/subreddit/checkMember",
}
