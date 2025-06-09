import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect,useState } from 'react';
import {getSubreddit} from '../../services/operations/profileAPI.js';
import { ButtonStyle } from './ButtonStyle.jsx';
import { Link } from 'react-router-dom';

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
    <div>
      {
        subreddit.map((sub)=>(
          <Link to={`/r/${sub}`}>
            <ButtonStyle name={`r/${sub}`} />
          </Link>
        ))
      }
    </div>
  )
}

export default Community