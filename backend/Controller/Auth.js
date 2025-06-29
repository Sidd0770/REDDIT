import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Profile from "../Models/Profile.js";
import OTPVerification  from '../Models/OTPVerification.js'; // New OTP model
import sendEmail  from '../utils/sendEmail.js'; // Your email utility
import Interest from "../Models/Interest.js"; // Assuming you have an Interest model

dotenv.config();

const  SECRET_KEY=process.env.JWT_SECRET;
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password: plainPassword } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            if (user.isVerified) {
                return res.status(409).json({
                    success: false,
                    message: "User with this email or username already exists and is verified."
                });
            } else {
                // If user exists but not verified, we can resend OTP or update existing record.
                // For simplicity, we'll delete any existing OTP for this user and create a new one.
                await OTPVerification.deleteMany({ userId: user._id }); // Clean up old OTPs for this user
                console.log("Existing unverified user found. Generating new OTP.");
            }
        }

        const password = await bcrypt.hash(plainPassword, 10);

        if (!user) {
            // Create a new unverified user if not found
            user = await User.create({
                email,
                username,
                password,
                isVerified: false, // User is unverified initially
            });
        } else {
            // Update the existing unverified user (e.g., if they retry registration with new details)
            user.username = username;
            user.email = email;
            user.password = password;
            await user.save();
        }

        // Generate and store OTP in the separate OTPVerification model
        const otp = generateOTP();
        await OTPVerification.create({
            userId: user._id,
            otp: otp,
            // createdAt field will automatically set and TTL index will handle expiry
        });

        // Send OTP email
        const emailSent = await sendEmail(
            user.email,
            'Verify Your Account - OTP',
            `<p>Your One-Time Password (OTP) for account verification is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`
        );

        if (!emailSent) {
            // If email sending fails, you might want to delete the user or mark for manual review
            // Depending on your policy, you might even delete the user record if initial OTP fails
            // await User.findByIdAndDelete(user._id); // Consider this if email is critical for registration
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please try again.",
            });
        }
        const data = {
            userId: user._id,
            email: user.email,
            username: user.username
        };
        // Do NOT create profile or generate token yet. That happens after OTP verification.
        res.status(202).json({ // 202 Accepted - processing has begun but not completed
            success: true,
            message: "User registered. Please check your email for OTP to verify your account.",
            data:data
             // Send user ID so frontend can use it for verification
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "User Registration Failed",
            error: err.message,
        });
    }
};
 
// Endpoint for OTP verification
export const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        console.log("Received OTP verification request:", req.body);
        console.log("Verifying OTP for user:", userId, "with OTP:", otp);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Account already verified." });
        }

        // Find the OTP record for this user
        const otpRecord = await OTPVerification.findOne({ userId: userId, otp: otp });

        if (!otpRecord) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
        }

        // If OTP is found and not expired (thanks to TTL index, expired ones are auto-deleted)
        // Mark user as verified
        user.isVerified = true;
        await user.save();

        // Delete the used OTP record
        await OTPVerification.deleteOne({ _id: otpRecord._id });

        // Create Profile of the User and pass the userId
        let newProfile = await Profile.findOne({ userID: user._id });
        if (!newProfile) {
            newProfile = await Profile.create({
                userID: user._id,
                username: user.username
            });

            //generate the Interest model for the user
            await Interest.create({
                userID: user._id,
                likes: {},
                frequent: {}
            });
        }

        
       

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: "/"
        });

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
            },
            token,
            message: "User Verified and Registered Successfully",
            profileID: newProfile._id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "OTP Verification Failed",
            error: err.message,
        });
    }
};

// ... (Your googleSignIn controller remains the same as before)
export const googleSignIn = async (req, res) => {
    try {
        const { idToken } = req.body; // Token sent from Google on the frontend

        if (!idToken) {
            return res.status(400).json({ success: false, message: "Google ID token is required." });
        }

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload; // 'sub' is Google's unique user ID

        // 1. Check if user already exists in your DB by Google ID or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // User exists, check if they registered via Google or email/password
            if (!user.googleId && user.email === email) {
                // User exists with this email but not via Google. Link Google ID.
                user.googleId = googleId;
                // You might also want to remove the password if they now sign in with Google primarily
                // user.password = undefined; // Careful with this, depends on your desired flow
                await user.save();
                console.log("Existing user linked with Google account.");
            } else if (user.googleId && user.googleId !== googleId) {
                // This scenario should ideally not happen if googleId is unique,
                // but good to have a check. Means another Google account has this email.
                return res.status(409).json({ success: false, message: "Email already associated with another Google account." });
            }
            // If user already registered with this googleId, just proceed.
        } else {
            // User does not exist, create a new user record for Google sign-in
            user = await User.create({
                email,
                username: name, // Use Google name as username, or prompt for custom
                googleId,
                isVerified: true, // Google accounts are implicitly verified
                // password field will be undefined as it's not required for Google sign-in
            });

            // Create Profile for the new Google user
            await Profile.create({
                userID: user._id,
                username: user.username,
                // profilePicture: picture // Add profile picture from Google if desired
            });
        }

        // Generate JWT token for the user
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: "/"
        });

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                googleId: user.googleId,
            },
            token,
            message: "Successfully signed in with Google",
            profileID: user.profile // Assuming `profile` field in User model stores profile ID
        });

    } catch (err) {
        console.error("Google Sign-In Error:", err);
        res.status(500).json({
            success: false,
            message: "Google Sign-In Failed",
            error: err.message,
        });
    }
};


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