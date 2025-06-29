import React from 'react'
import { useState } from 'react';
import {register} from '../services/operations/authAPI';
// import { useDispatch } from 'react-redux';
// import { setLogin, setUserId } from '../services/Slices/loginSlice';
import OTPVerification from './OTPverification';

const AuthorSignup = (props) => {
  
   const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [username,setUsername]=useState('');
    const [userId,setUserId]=useState('');
    const [showOtpVerification,setShowOtpVerification]=useState(false);
    console.log("OTP Verification Component Visible:",showOtpVerification);


    const setSignupPage=()=>{
      props.setsignup(false);
      props.setlogin(true);
    }
  

    const onSubmit=async()=>{
      if(email==='' || password===''){
        alert('Please fill all the fields');
      }
      try {
        const response= await register(email,username,password)
        
        if (response.success) {
              
                // Access the _id from the nested 'data' object correctly
                setUserId(response.data.userId);
                console.log("User ID from registration response:", response.data.userId);
                // Set the state to true to conditionally render the OTP component
                setShowOtpVerification(true);

            } else {
                // Handle API error messages
                alert(response.message || 'Registration failed. Please try again.');
                
                
            }
        
      } catch (error) {
          console.error("Registration error:", error);
          alert('An unexpected error occurred during registration. Please check the console.');
      }
    }   
      
    return (
      <div className='w-screen h-screen z-20 flex items-center justify-center absolute top-0 left-0' style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
        <div className='flex flex-col self-center justify-between  text-white bg-black w-[40%] mx-4 p-5 border border-gray-700 rounded-[2rem] h-[80%]'>
            {showOtpVerification ? 
              (<>
                
                <OTPVerification userId={userId} username={username} email={email} setShowOtpVerification={setShowOtpVerification} setsignup={props.setsignup} />    
              </>)      
              :
              (<>
                  <h1 className='flex justify-center my-5 text-2xl'>Sign Up</h1>
                  <h2 className='flex justify-center my-2 text-xl'>
                    By continuing, you agree to our User Agreement and acknowledge that you understand the Privacy Policy.
                  </h2>
                  
                  <div className='flex flex-row justify-center my-1'>
                    <button className='p-1 text-black flex bg-white rounded-full w-[70%] m-1'>continue with phone number</button>
                  </div>    
                  <div className='flex flex-row justify-center my-1'>
                    <button className='p-1 text-black bg-white rounded-full w-[70%] m-1'>continue with Google</button>
                  </div>   
                  <div className='flex flex-row justify-center my-1'>
                    <button className='p-1 text-black bg-white rounded-full w-[70%] m-1'> continue with Apple</button>
                  </div>    
                    
                  
                  <div className='flex items-center'>
                      <div className="w-[45%] mx-2 h-px bg-gray-300"></div>
                      <div >OR</div>
                      <div className="w-[45%] mx-2 h-px bg-gray-300"></div>
                  </div>
        
                  <div className='flex flex-col justify-center items-center w-full'>
                    <input className=' bg-gray-600 m-1 w-[70%] p-2 rounded-full my-2' placeholder='Email  *'
                            onChange={(e)=>setEmail(e.target.value)}  
                    />
                    <input className=' bg-gray-600 m-1 w-[70%] p-2 rounded-full my-2' placeholder='username*'
                            onChange={(e)=>setUsername(e.target.value)}  
                    />

                    <input className=' bg-gray-600 m-1 w-[70%] p-2 rounded-full my-2' placeholder='Password*'
                            onChange={(e)=>setPassword(e.target.value)}  
                    />

                  </div>
                  
                  <div className='flex flex-col justify-center items-center w-full'>
              
                    <p> 
                      <span>Already a Redditor?</span>
                      <a onClick={setSignupPage}> Sign In</a>
                    </p>
                  </div>              
                  
                  <button onClick={onSubmit} className='flex justify-center my-4 border border-gray-700 p-2'>
                    Submit
                  </button>
              </>)
            }
            
  
        </div>  
      </div>
    )
  }

export default AuthorSignup