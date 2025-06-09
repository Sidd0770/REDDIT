import {v2 as cloudinary} from 'cloudinary';
import {fs} from 'fs';

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary =async(file)=>{
    try{
        if(!file) return null;
        const response=await cloudinary.uploadder.upload(
            file,{
                resource_type:'auto',
            })
        console.log("file is uploaded on cloudinary",response.url);
        return response;

    }catch(error){
        //remove the file from local storage
        fs.unlinkSync(file);
        return null;

    }
}



const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
