import axios from "axios";
import { profileEndpoints } from "../api";

const{
    GET_PROFILE,
    USER_FEED,
    SUBREDDITS
}=profileEndpoints;

export const getProfile=async(username,filters)=>{
    try{
        
        const response=await axios.get(GET_PROFILE+username,{
            params:{
                filter:filters
            },
            withCredentials:true,
        });
        

        
        return response;
        
    }catch(error){
        console.log("error in getting profile",error);
    }
}

export const UserFeed=async(username)=>{
    try{
        const response =await axios.get(USER_FEED,
            {
                params:{
                    username:username
                },
                withCredentials:true,
            }
        );
        return response.data.data;

    }catch(error){
        console.log("error in getting user feed",error);
        throw error;
    }
}

export const getSubreddit =async()=>{
    try{
    
        const response=await axios.get(SUBREDDITS,
            {withCredentials:true}
        );
        return response.data.data;
    }
    catch(error){
        console.log("Error in getting subreddits",error);
        throw error;
    }
}
