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
    <div className='flex flex-col gap-4 overflow-y-auto h-[calc(100vh-76px)] pb-8 pr-1'>
        {
          posts.map(post=>(
            <Post key={post._id} {...post} />
          ))
        }
    </div>
  )
}

export default CustomFeeds