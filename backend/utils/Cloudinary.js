import {v2 as cloudinary} from 'cloudinary';
import * as fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_CLOUD_API_KEY, 
        api_secret:process.env.CLOUDINARY_CLOUD_API_SECRET
});

export const uploadOnCloudinary =async(file)=>{
    try{
        if(!file){
            console.log("No local file path provided for Cloudinary upload");
            return null;
        }
        const response=await cloudinary.uploader.upload(
            file,{
                resource_type:'auto',
            })
        console.log("file is uploaded on cloudinary",response.url);

        if(fs.existsSync(file)){
            fs.unlinkSync(file);
            console.log("file is removed from local storage");
        }
        return response;

    }catch(error){
        //remove the file from local storage
        console.error("Cloudinary upload failed with error:", error); 
        if(fs.existsSync(file)){
            fs.unlinkSync(file);
            console.log("file is removed from local storage 2222" );
        }
        return null;

    }
}

