import axios from "axios";
import { postsEndpoints,commentEndPoints } from "../api.js";

const {
    GET_COMMENTS,
    CREATE_COMMENT,
    SEARCH_COMMENTS,
}=commentEndPoints;

const {
    GET_ALL_POSTS,
    
}=postsEndpoints;

export const getComments=async(rootID,parentID)=>{
    try{
        console.log("Root ID:", rootID);
        console.log("Parent ID:", parentID);
        console.log(GET_COMMENTS+rootID);
        const response=await axios.get(GET_COMMENTS+rootID,{
            params:{
                parentID:parentID,
            },     
            withCredentials:true,
        });
        console.log("response from get comments api",response);

        const allcomments=response.data.data;
        
        return allcomments;

    }
    catch(error){
        console.log("Comment fetching failed",error);
    }
}

export const createComment=async(data)=>{
    try{
        console.log(data);
        console.log("--- FormData Contents ---");
        for (const pair of data.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        console.log("--- End FormData Contents ---");
        const response=await axios.post(CREATE_COMMENT,data,
            {withCredentials:true});
        
        console.log("Post Data ",response.data);
 
    }catch(error){
        console.log("Post Creation Failed ",error);
        throw error;
    }
}

export const searchComments=async(text)=>{
    try{
        const response=await axios.get(SEARCH_COMMENTS,{
            params:{
                search:text,
            },
            withCredentials:true,
        });
        console.log("response from search comments api",response);
        return response.data.data;
        
    }catch(error){
        console.log("Comment searching failed",error);
    }
}

