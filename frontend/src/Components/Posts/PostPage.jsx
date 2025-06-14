import React, { useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { getPostById,increaseViewCount} from '../../services/operations/postsAPI';
import { useState } from 'react';
import { ModControls } from '../../services/operations/subredditAPI';
import Post from './Post';

const PostPage = () => {
    const {id}=useParams();
    // console.log(id);
    const [loading,setLoading]=useState(true); 
    const [error,setError]=useState(false); 
    const [postData,setpostData]=useState([]);
    
    const [mod,setMod]=useState(false);

   useEffect(()=>{
        setLoading(true);
        getPostById(id).then((data)=>{
          const response = data.data.data;
          setpostData(response)

          ModControls(response.subreddit).then((res)=>{    
            if(res){
              setMod(true);
            }
          })

        })
        .then(()=>setLoading(false))
        .catch(()=>{
          setError(true)
          setLoading(false) 
        })
        
        increaseViewCount(id);

        //Increase the Post View Count 
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
            <Post {...postData} moderator={mod} open={true}/>        
        )}
    </div> 
  )
}

export default PostPage