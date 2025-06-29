import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    isVerified: { // For email verification
        type: Boolean,
        default: false
    },
    googleId: { // For Google sign-in
        type: String,
        unique: true,
        sparse: true // Allows null values, but ensures uniqueness for non-null
    },
})

const User = mongoose.model('User',UserSchema);

export default User;