import React from 'react'
import { useState } from 'react'
import {useSelector} from 'react-redux'
import {getProfile} from '../../services/operations/profileAPI'

const NavigationBar = () => {
    const userId= useSelector((state)=>state.user.userId)
    const [posts,setPosts]=useState([]);
    
    const recent=()=>{

    }

    const post=()=>{
        setPosts([]);
        getProfile(userId,"postsCreated")
        .then(
            (data)=>{
                console.log(data.postsCreated);
                setPosts(data.postsCreated);
            }
        )
        
    }

    const comments=()=>{
        
    }

  return (
    <div className='flex'>
        <Buttons name="overview" fun={recent}/>
        <Buttons name="posts" fun={post}/>
        <Buttons name="comments" fun={comments}/>

    </div>
  )
}

const Buttons=({name,fun})=>{
    return(
        <button onClick={fun} className='rounded-full bg-amber-600 mx-2 p-2 hover:text-white'>
            {name}
        </button>
    )
}
  


export default NavigationBar