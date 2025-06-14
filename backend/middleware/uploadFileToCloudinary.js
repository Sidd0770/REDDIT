import  {uploadOnCloudinary} from '../utils/Cloudinary.js';

export const uploadFileToCloudinary =async(req,res,next)=>{
    try {
        //if no file exists 
        if(!req.file){
            req.cloudinaryUrl=null;
            req.cloudinaryPublicId=null;
            return next();
        }
        //req.file from multer middleware
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

        if(!cloudinaryResponse){
            return res.status(500).json({
                success: false,
                message: "Error uploading file to Cloudinary"
            });
        }

        req.cloudinaryUrl = cloudinaryResponse.url;
        req.cloudinaryPublicId = cloudinaryResponse.public_id;
        next();

    } catch (error) {
        console.error("Error in uploadFileToCloudinary middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}