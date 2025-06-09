import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../Models/User.js';
dotenv.config();

export const verifyToken=async(req,res,next)=>{
    
    try {
        //Extracting the jwt from request cookies,body,header
        const token=req.cookies.token || req.body.token ||req.headers["authorization"];

        //jwt is missing 
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Login First"
            });
        }
        // console.log(token);
        
        //verify the jwt token using the secret key 
        const decode = await jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
        next();

    } catch (error) {
        res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
        });
    }
}