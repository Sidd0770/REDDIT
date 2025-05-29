import axios from "axios";
import { profileEndpoints } from "../api";

const{
    GET_PROFILE,
    USER_FEED
}=profileEndpoints;

export const getProfile=async(username,filters)=>{
    try{
        console.log("username in get profile api",username);
        const response=await axios.get(GET_PROFILE+username,{
            params:{
                filter:filters
            },
            withCredentials:true,
        });
        

        // console.log("response from get profile api",response);    
        console.log("response from get profile api",response);
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
        console.log("response from user feed api",response.data.data);
        return response.data.data;

    }catch(error){
        console.log("error in getting user feed",error);
        throw error;
    }
}
