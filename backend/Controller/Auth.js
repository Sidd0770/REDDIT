import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Profile from "../Models/Profile.js";
const  SECRET_KEY=process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password:plainPassword} = req.body;

        const password = await bcrypt.hash(plainPassword, 10);
        console.log("password", password);

        const info = await User.create({
            email,
            username,
            password,
        });

        //create Profile of the User and pass the userId
        const newProfile=await Profile.create({
            userID:info._id,
            username:info.username
        })

        const token=jwt.sign(
            {id:info._id,username:info.username},
            SECRET_KEY,{expiresIn:"2h"}
        );
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            path:"/"
        });
        console.log(info);
        
        res.status(200).json({
            success: true,
            data: info,
            token,
            message: "User Registered Successfully",
            profileID:newProfile._id
        });
    } catch (err) {
        console.error(err); // Use console.error for errors
        res.status(500).json({
            success: false,
            message: "User Registration Failed",
            error: err.message, // Include error message for debugging
        });
    }
};
// export default registerUser;

export const loginUser = async (req, res) => {
    try{

        const {username, password} = req.body;
        const user =await User.findOne({username});
                    
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }
        const isMatch =await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            })
        }
        //generate jwt token 
        if(await bcrypt.compare(password,user.password)){
            const token =jwt.sign({id:user._id,username:user.username},SECRET_KEY,{expiresIn:"2h"});

            user.token=token;
            user.password=undefined;
            //set cookie for token
            const options={
                expires: new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true,
                path:"/"
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,          
                message:"token Success"
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
              })
        }

    }catch(err){
        console.log(err);
    }
}