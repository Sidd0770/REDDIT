import React from 'react'
import { useState } from 'react';
import { Login } from '../services/operations/authAPI';
import { useDispatch } from 'react-redux';
import { setLogin,setUser ,setUserId} from '../services/Slices/loginSlice';

const AuthorLogin = (props) => {
  const dispatch=useDispatch();

  const [password,setPassword]=useState('');
  const [username,setUsername]=useState('');

  const setsignupPage=()=>{
    props.setsignup(true);
    props.setlogin(false);
  }

  const onSubmit=async(e)=>{
    
    if(username==='' || password===''){
      alert('Please fill all the fields');
    }else{
      props.setlogin(false);
    }

    e.preventDefault();

    // using apiconnector
    Login(username,password)
      .then((res)=>{
          dispatch(setUser(username)),
          dispatch(setUserId(res._id)),
          dispatch(setLogin(true))
      })
  
  }

  return (

    <div className='w-screen h-screen z-10 flex items-center justify-center absolute top-0 left-0' style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className='flex flex-col self-center justify-between  text-white bg-black w-[40%] mx-4 p-5 border border-gray-700 rounded-[2rem] h-[80%]'>
          
          <h1 className='flex justify-center my-5 text-2xl'>Log In</h1>
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
            <input className=' bg-gray-600 m-1 w-[70%] p-2 rounded-full my-2' placeholder='Email or UserName *' 
                  onChange={(e)=>
                    setUsername(e.target.value

                    )} 
                  value={username} 
            />
            <input className=' bg-gray-600 m-1 w-[70%] p-2 rounded-full my-2' placeholder='Password *' 
                  onChange={(e)=>setPassword(e.target.value)} type='password' value={password}
            />
          </div>
          
          <div className='flex flex-col justify-center items-center w-full'>
            <a> Forget Password</a>  
            <p> 
              <span>New to Reddit?</span>
              <a onClick={setsignupPage}> Sign Up</a>
            </p>
          </div>              
          
          <button onClick={onSubmit} className='flex justify-center my-4 border border-gray-700 p-2 '>
            LOG IN
          </button>

      </div>  
    </div>
  )

}

export default AuthorLogin