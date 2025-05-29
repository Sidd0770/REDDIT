import {ENDPOINTS } from '../api.js';
// import apiConnector from "../apiConnector.js";
import axios from "axios";


const {
    REGISTER_API,
    LOGIN_API,
    INIT_LOGIN_API
}=  ENDPOINTS;

export const register=async(email,username,password)=>{
    console.log(REGISTER_API);
    // return ()=>{
        
    //     try{
    //         console.log("hello");
    //         const response= apiConnector("POST",REGISTER_API,{email,username,password});
              
    //         console.log("response from register api",response);

    //         if (!response.data.success) {
    //             throw new Error(response.data.message)
    //         }

    //     }catch(error){
    //         console.error('hello-2');
    //         console.log("error in register api",error);
    //     }
    // }

    try {
        const data={email,username,password};
        console.log(data)
        const response = await axios.post(REGISTER_API, data, {
            withCredentials: true,
        });
        console.log("the data required")
        console.log(response.data);
        
    } catch (error) {
        console.error('Registration failed:', error);
        if (error.response) {
            console.log(error.response.data);
        }
    }
}


export const Login =async(username,password)=>{
    try{
        const data={username,password};
        console.log(data);
        const response=await axios.post(LOGIN_API,data,{
            withCredentials:true,
        });

        return response.data.user;

    }catch(error){
        console.log("error in login api",error);
    }
}

export const GetDataFromCookie=async()=>{
    try{
        const response =await axios.get(INIT_LOGIN_API,{
            withCredentials:true,
        });
        return response.data.user;


    }catch(error){
        console.log("error in getting data from cookie",error);
    }
}