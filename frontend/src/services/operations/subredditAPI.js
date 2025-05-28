import axios from 'axios';
import { subredditEndpoints } from '../api.js';

const{JOIN_SUBREDDIT,CREATE_SUBREDDIT}=subredditEndpoints;

export const joinSubreddit =async(id ,subreddit)=>{
    try{
        axios.put(JOIN_SUBREDDIT,{
            id:id,
            subreddit:subreddit
            
        })
    }catch(error){
        console.log("error in joining subreddit",error);
    }
}