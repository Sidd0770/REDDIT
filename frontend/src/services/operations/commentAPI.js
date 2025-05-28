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
        const response=await axios.get(GET_COMMENTS+rootID);
        const allcomments=response.data.data;
        // Filter the comments based on parentID
        const filteredComments =allcomments.filter(
            (comment)=> comment.parentID===parentID
        );
        return filteredComments;

    }
    catch(error){
        console.log("Comment fetching failed",error);
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

