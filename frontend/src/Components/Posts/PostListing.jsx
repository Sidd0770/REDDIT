import React from 'react'
import { useState,useEffect } from 'react'
import Post from './Post'
import {getAllposts} from '../../services/operations/postsAPI';

const PostListing = (props) => {
  const [posts,setPosts]=useState([]);
  const type =props.type;
  const subreddit=props.subreddit;
  
  useEffect(() => {
    getAllposts(subreddit).then((response)=>{
      console.log(response);
      setPosts(response);
    })
  }, []);

  // console.log("posts",posts);

  return (
    <div  className='overflow-y-scroll h-[100vh]'>
        {posts.map(post=>(
          <Post key={post._id} {...post} type={type}/>
        ))}
    </div>
  )
}

export default PostListing