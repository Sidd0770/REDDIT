import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect,useState } from 'react';
import {getSubreddit} from '../../services/operations/profileAPI.js';
import { ButtonStyle } from './ButtonStyle.jsx';
import { Link } from 'react-router-dom';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const Community = () => {
  const [subreddit,setSubreddit]=useState([]);

  useEffect(()=>{
    getSubreddit()
      .then((response)=>{
        setSubreddit(response);
      })
      .catch((error)=>{
        console.error("Error fetching subreddit data:", error);
      })
  },[]);

  return (
    <div className='pt-2'>
      <h3 className='px-4 py-2 text-xs font-semibold text-[#818384] uppercase tracking-wider'>Communities</h3>
      {
        subreddit.map((sub)=>(
          <Link to={`/r/${sub}`} key={sub}>
            <ButtonStyle name={`r/${sub}`} icon={faUsers} />
          </Link>
        ))
      }
    </div>
  )
}

export default Community