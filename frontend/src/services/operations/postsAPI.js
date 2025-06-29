import axios from "axios";
import { postsEndpoints } from "../api";

const {
  GET_ALL_POSTS,
  GET_POST_BY_ID,
  CREATE_POST,
  CHANGEVOTES,
  TRENDING_POSTS,
  UPVOTE_POST,
  DOWNVOTE_POST,

INCREASE_VIEW_COUNT,
    DELETE_POST
  
}=postsEndpoints;

export const getAllposts = async (subreddit) => {
    try {
        const sub =subreddit;
        const data =await axios.get(GET_ALL_POSTS,{withCredentials:true});
        const dd=data.data;
        //if the subreddit is not null then filter the posts by subreddt 
        
        if(sub){
            
            const filteredPosts=dd.data.filter((post)=>(
                post.subreddit===sub
            ))
            return filteredPosts;
        }
        
        return dd.data;

    } catch (error) {
        console.error('getting Post Failed', error)
    }
}

export const createPost=async(data)=>{
    try{
        console.log(data);
        const response=await axios.post(CREATE_POST,data,
            {withCredentials:true});
        
        
 
    }catch(error){
        console.log("Post Creation Failed ",error);
        throw error;
    }
}

export const getPostById=async(id)=>{
    try{
        const response=await axios.get(GET_POST_BY_ID+id,{
            withCredentials:true
        });
            
        return response;
    }
    catch(error){
        console.log("Post fetching failed",error);
    }
}


export const upvotePost =async (postId)=>{
    try {
        const response = await axios.put(UPVOTE_POST+postId,
            {}, 
            {withCredentials:true});
        return response.data;
    } catch (error) {
        console.log("Error in upvoting post",error);
        throw error;
    }
}

export const downvotePost =async (postId)=>{
    try {
        const response = await axios.put(DOWNVOTE_POST+postId,
            {}, 
            { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log("Error in downvoting post", error);
        throw error;
    }
}

export const increaseViewCount=async(id)=>{
    try{
        const response =await axios.put(INCREASE_VIEW_COUNT+id,
            {},
            {withCredentials:true});
        

    }catch(error){
        console.log("Error in increasing post view count",error);
        throw error;
    }
}

export const getTrendingPosts =async () =>{
    try{
        const response =await axios.get(TRENDING_POSTS,
            {withCredentials:true})
        return response.data.data;
    }catch(error){
        console.log("error in getting trending posts",error);
        throw error;
    }
}

export const deletePost =async(id)=>{
    try{
        
        const response =await axios.put(DELETE_POST+id,null,{
            
            withCredentials:true
        })
        
        return response;
    }catch(error){
        console.log("Error in deleting post",error);
        throw error;
    }
}
