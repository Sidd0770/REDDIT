import React from 'react'
import { useEffect,useState } from 'react'
import { getTrendingPosts } from '../../services/operations/postsAPI';
import Post from '../Posts/Post';

const Trending = () => {
    const [posts,setPosts]=useState([]);
    useEffect(() => {
        getTrendingPosts()
        .then((response)=>{
            console.log("trending posts response",response);
            setPosts(response);
        })
        .catch((error) =>{
            console.log("Error fetching trending posts",error);
        })
    },[]);

  return (
    <div className='flex flex-col gap-4 overflow-y-auto h-[calc(100vh-76px)] pb-8 pr-1'>
        {
          posts.map(post=>(
            <Post key={post._id} {...post}/>
          ))
        }
    </div>
  )
}

export default Trending