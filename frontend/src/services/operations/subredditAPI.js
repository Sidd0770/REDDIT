import axios from 'axios';
import { subredditEndpoints } from '../api.js';

const{
    JOIN_SUBREDDIT,
    CREATE_SUBREDDIT,
    CHECK_MEMBER
}=
subredditEndpoints;

export const joinSubreddit =async(id ,subreddit)=>{
   
    try{
        const response =axios.put(JOIN_SUBREDDIT,{
            id:id,
            subreddit:subreddit           
        })
        console.log("Response from joinSubreddit API:", response);

    }catch(error){
        console.log("error in joining subreddit",error);
    }
}

export const checkMember =async(userId,subreddit)=>{
    try{
        console.log(userId)
        const response =await axios.get(CHECK_MEMBER,{
            params:{
                id:userId,
                subreddit:subreddit,
            }
        }    
        );

        console.log("Response from checkMember API:", response);
        return response.data.isMember; 

    }catch(error){
        console.log("error in checking member",error);
    }
}