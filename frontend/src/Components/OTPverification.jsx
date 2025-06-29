// src/components/OTPVerification.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { verifyOTP } from '../services/operations/authAPI'; // You'll create this in authAPI
import { setLogin } from '../services/Slices/loginSlice';
import { useNavigate } from 'react-router-dom'; // If you use react-router-dom for navigation
import { useSelector } from 'react-redux';
import { setUserId, setUser, setEmail } from '../services/Slices/loginSlice'; // Assuming you have these actions in your userSlice

const OTPVerification = (props) => {
    console.log("INSIDE OTP VERIFICATION COMPONENT");
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate(); // For redirection after successful verification // Assuming you store userId in Redux state
    const handleVerifyOTP = async () => {
        setError(''); // Clear previous errors
        if (otp.length !== 6) { // Assuming 6-digit OTP
            setError('Please enter a valid 6-digit OTP.');
            return;
        }
        setLoading(true);
        try {
            const response = await verifyOTP(props.userId, otp); // Your API call
            if (response.success) {
                dispatch(setLogin(true));
                dispatch(setUserId(props.userId)); // Assuming you have setUserId in your Redux actions
                dispatch(setUser(props.username)); 
                dispatch(setEmail(props.email)); 
                alert('OTP verified successfully!');
                props.setShowOtpVerification(false);
                props.setsignup(false);
                navigate('/');
            } else {
                setError(response.message || 'OTP verification failed.');
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            setError(err.message || 'An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        // Implement logic to call your backend's resend OTP API
        // This would typically be another API call to /api/auth/resend-otp
        // which takes userId and sends a new OTP email
        
        alert('Resending OTP... (Implement resend logic)');
        // You might want to prevent rapid resending
    };

    return (
        <div className='w-screen h-screen z-20 flex items-center justify-center absolute top-0 left-0' style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
            <div className='flex flex-col self-center justify-between  text-white bg-black w-[40%] mx-4 p-5 border border-gray-700 rounded-[2rem] h-[80%]'>
                <h2 className='text-xl mb-4'>Verify Your Email</h2>
                <p className='mb-4 text-center'>An OTP has been sent to your email. Please enter it below to verify your account.</p>
                <input
                    type="text"
                    maxLength="6"
                    className='bg-gray-600 p-2 rounded-full my-2 text-center'
                    placeholder='Enter OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                />
                {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                <button
                    onClick={handleVerifyOTP}
                    className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full my-4 w-[70%]'
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
                <p className='text-sm'>
                    Didn't receive the OTP?{' '}
                    <button
                        onClick={handleResendOTP}
                        className='text-blue-400 hover:underline'
                        disabled={loading}
                    >
                        Resend OTP
                    </button>
                </p>
                <button onClick={() =>{
                    props.setShowOtpVerification(false);
                }} className='mt-4 text-gray-400 hover:text-white'>
                    Close
                </button>
            </div>
        </div>
    );
};

export default OTPVerification;