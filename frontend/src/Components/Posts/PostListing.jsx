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
  }, [subreddit]);

  // console.log("posts",posts);

  return (
    <div className='flex flex-col gap-4 overflow-y-auto h-[calc(100vh-76px)] pb-8 pr-1'>
        {posts.map((post, index) =>(
          <div key={post._id} style={{ animationDelay: `${index * 0.05}s` }}>
            <Post {...post} type={type}/>
          </div>
        ))}
    </div>
  )
}

export default PostListing