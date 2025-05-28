import axios from "axios";
import { postsEndpoints } from "../api";

const {
  GET_ALL_POSTS,
  GET_POST_BY_ID,
  CREATE_POST,
  CHANGEVOTES
  
}=postsEndpoints;

export const getAllposts = async (subreddit) => {
    try {
        const sub =subreddit;
        const data =await axios.get(GET_ALL_POSTS,{withCredentials:true});
        const dd=data.data;
        //if the subreddit is not null then filter the posts by subreddt 
        
        if(sub){
            console.log(sub);
            console.log(dd);
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
        
        console.log("Post Data ",response.data);

        
    }catch(error){
        console.log("Post Creation Failed ",error);
        
    }
}

export const getPostById=async(id)=>{
    try{
        const response=await axios.get(GET_POST_BY_ID+id);
            
        return response;
    }
    catch(error){
        console.log("Post fetching failed",error);
    }
}

export const changeVotes=async(id,vote)=>{
    try{
        const response=await axios.put(CHANGEVOTES+id,{votes:vote});
        // console.log("response",response.data.data);
        return response;
    }catch(error){
        console.log("Post fetching failed",error);
    }
}

