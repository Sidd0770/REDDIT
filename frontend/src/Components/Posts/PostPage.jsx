import React, { useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { getPostById } from '../../services/operations/postsAPI';
import { useState } from 'react';
import Post from './Post';

const PostPage = () => {
    const {id}=useParams();
    // console.log(id);
    const [loading,setLoading]=useState(true); 
    const [error,setError]=useState(false); 
    const [postData,setpostData]=useState([]);

   useEffect(()=>{
        setLoading(true);
        getPostById(id).then(data=>setpostData(data.data.data))
        .then(()=>setLoading(false))
        .catch(()=>{
          setError(true)
          setLoading(false)
        })
        
   },[])
   
   if(loading){
    return <div>Loading...</div>
   }
   if(error){
    return <div>Error</div>
   }

  return (
    <div className='h-[100vh]'>
        {postData && (
            <Post {...postData} open={true}/>        
        )}
    </div> 
  )
}

export default PostPage