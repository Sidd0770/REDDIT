import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { ButtonStyle } from './ButtonStyle.jsx';
import { faHome, faFire, faCompass, faGlobe } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const navigate =useNavigate();
  const username =useSelector(state=>state.user);
  
  const home=()=>{
    if (username) {
      navigate(`/feed/${username}`);
    } else {
      navigate('/');
    }
  }
  const trending=()=>{
    navigate('/Popular');
  }
  const explore=()=>{
    navigate('/explore');
  }

  return (
    <div className='border-b border-[#343536] pb-2 mb-2'>
      <div className='flex flex-col py-1'>
        <ButtonStyle name="Home" fun={home} icon={faHome}/>
        <ButtonStyle name="Popular" fun={trending} icon={faFire}/>
        <ButtonStyle name="Explore" fun={explore} icon={faCompass}/>
        <ButtonStyle name="All" icon={faGlobe}/>
      </div>
    </div>
  )
}

export default Home