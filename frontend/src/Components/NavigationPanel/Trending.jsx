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
    <div  className='overflow-y-scroll h-[100vh]'>
        {
          posts.map(post=>(
            <Post key={post._id} {...post}/>
          ))
        }
    </div>
  )
}

export default Trending