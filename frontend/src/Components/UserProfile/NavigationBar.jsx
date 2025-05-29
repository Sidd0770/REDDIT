import React from 'react'
import { useState } from 'react'
import {useSelector} from 'react-redux'
import {getProfile} from '../../services/operations/profileAPI'
import Post from '../Posts/Post'

const NavigationBar = () => {
    const username= useSelector(state=>state.user);
    
    const [posts,setPosts]=useState([]);
    
    const recent=()=>{
        setPosts([]);
        getProfile(username,"recentPosts")
        .then((response)=>{
            
            setPosts(response.data.data.recentPosts);
        });
        
    }

    const post=()=>{
        setPosts([]);
        getProfile(username,"postsCreated")
        .then(
            (data)=>{
                setPosts(data.data.data.postsCreated);
            }
        )   
    }

    const comments=()=>{
        setPosts([]);
        getProfile(username,"commentsCreated")
        .then(
            (data)=>{
                setPosts(data.data.data.commentsCreated);
            }
        )   
    }

  return (
    <div >
        <div className='flex items-center mr-2'>
            <Buttons  name="overview" fun={recent}/>
            <Buttons name="posts" fun={post}/>
            <Buttons name="comments" fun={comments}/>

        </div>
        
        
        {
        posts.map((post)=>(
            <Post key={post._id} {...post} />
        ))
        }


    </div>
  )
}

const Buttons=({name,fun})=>{
    return(
        <button onClick={fun} className='rounded-full mx-2 p-2 hover:bg-orange-400  hover:underline'>
            {name}
        </button>
    )
}
  


export default NavigationBar