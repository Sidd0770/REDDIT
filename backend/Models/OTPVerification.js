// models/OTPVerification.js
import  mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // OTP will automatically expire and be deleted after 10 minutes (600 seconds)
    },
    
});
const OTPVerification = mongoose.model('OTPVerification', OTPSchema);

export default OTPVerification;
