import React from 'react'
import { UserFeed} from '../../services/operations/profileAPI.js';
import { useState,useEffect } from 'react';
import Post from '../Posts/Post.jsx';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ButtonStyle } from './ButtonStyle.jsx';

const CustomFeeds = () => {
  const username = useParams().username;
  const [posts,setPosts]=useState([]);

  useEffect(() => {
    UserFeed(username)
      .then((response)=>{
        console.log("response from user feed",response);
        setPosts(response);
      })
  },[username]);

  return (
    <div  className='overflow-y-scroll h-[100vh]'>
        {
          posts.map(post=>(
            <Post key={post._id} {...post} />
          ))
        }
    </div>
  )
}

export default CustomFeeds