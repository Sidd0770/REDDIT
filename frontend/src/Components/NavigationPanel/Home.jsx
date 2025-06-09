import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { ButtonStyle } from './ButtonStyle.jsx';

const Home = () => {
  const navigate =useNavigate();
  const username =useSelector(state=>state.user);
  console.log("username in home",username);
  
  const home=()=>{
    navigate(`/feed/${username}`);
  }
  const trending=()=>{
    navigate('/Popular');
  }

  return (
    <div className='border-b-2'>
      <div className='flex flex-col mb-4  h-[20vh]'>
        <div>
          <ButtonStyle name="Home" fun={home}/>
        </div>
        <div>
          <ButtonStyle name="Popular" fun={trending}/>
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



export default Home