import axios from "axios";
import { profileEndpoints } from "../api";

const{
    GET_PROFILE
}=profileEndpoints;

export const getProfile=async(id,filters)=>{
    try{
        const response=await axios.get(GET_PROFILE+id,{
            params:{
                filter:filters
            },
            withCredentials:true,
        });
        
        console.log("response from get profile api",response.data.data);

        return response.data.data;
        
    }catch(error){
        console.log("error in getting profile",error);
    }
}