import axios from 'axios';
import { subredditEndpoints } from '../api.js';

const{
    JOIN_SUBREDDIT,
    CREATE_SUBREDDIT,
    CHECK_MEMBER,
    MOD_CONTROLS
}=
subredditEndpoints;

export const joinSubreddit =async(subreddit)=>{
   
    try{
        const response =axios.put(JOIN_SUBREDDIT,{
            subreddit:subreddit           
        },
        {
            withCredentials:true
        });

    }catch(error){
        console.log("error in joining subreddit",error);
    }
}

export const checkMember =async(subreddit)=>{
    try{
        
        const response =await axios.get(CHECK_MEMBER,{
            params:{
                subreddit:subreddit,
            }
            ,withCredentials:true
        }    
        );

        return response.data.isMember; 

    }catch(error){
        console.log("error in checking member",error);
    }
}

export const ModControls =async(subreddit)=>{
    try{
        const response =await axios.get(MOD_CONTROLS,{
            params:{
                subreddit:subreddit,
            }
            ,withCredentials:true
        });
        return response.data.isModerator;
    }
    catch(error){
        console.log("error in ModControls",error);
        throw error;
    }
}