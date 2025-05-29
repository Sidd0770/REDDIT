import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { UserFeed} from '../../services/operations/profileAPI.js';

const Home = () => {
  const navigate =useNavigate();
  const username =useSelector(state=>state.user);
  console.log("username in home",username);
  

  const home=()=>{
    navigate(`/feed/${username}`);

  }

  return (
    <div className='border-b-2'>
      <div className='flex flex-col mb-4  h-[20vh]'>
        <div>
          <ButtonStyle name="Home" fun={home}/>
        </div>
        <div>
          <ButtonStyle name="Popular"/>
        </div>
        <div>
          <ButtonStyle name="Explore"/>
        </div>
        <div>
          <ButtonStyle name="All"/>
        </div>
      </div>


      
    </div>
  )
}

const ButtonStyle=({name,fun})=>{
  return(
    <div onClick={fun} className='text-black  p-2 hover:bg-[#2A3236] hover:text-white rounded-md pl-[4vw] onhover:bg-[#2A3236] cursor-pointer'>
      {name}
    </div>
  );
};

export default Home