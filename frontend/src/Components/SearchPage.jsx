import React from 'react'
import { useParams } from 'react-router-dom'
import { useState,useEffect } from 'react';
import { searchComments } from '../services/operations/commentAPI';
import Post from './Posts/Post';

const SearchPage = () => {
  const[posts,setPosts]=useState([]);

  const {keyword}=useParams();
  useEffect(()=>{
      searchComments(keyword).then((res)=>{
          console.log(res);
          setPosts(res);
      })
  },[keyword])
  

  //get all the posts with the keyword
   

  console.log(keyword);
  return (
    <div>
      {posts.map(post=>(
          <Post key={post._id} {...post}/>
        ))}
    </div>
  
  )
}

export default SearchPage