import React, { useEffect } from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import { getPostById,increaseViewCount} from '../../services/operations/postsAPI';
import { useState } from 'react';
import { ModControls } from '../../services/operations/subredditAPI';
import Post from './Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const PostPage = () => {
    const {id}=useParams();
    const navigate = useNavigate();
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
    return (
      <div className='h-[calc(100vh-76px)] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 rounded-full border-4 border-[#343536] border-t-[#ff4500] animate-spin'></div>
          <p className='text-[#818384] text-sm font-medium'>Loading post...</p>
        </div>
      </div>
    )
   }

   if(error){
    return (
      <div className='h-[calc(100vh-76px)] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-5 max-w-md text-center px-6'>
          {/* Icon */}
          <div className='w-20 h-20 rounded-full bg-[#1a1a1b] border border-[#343536] flex items-center justify-center'>
            <FontAwesomeIcon icon={faTriangleExclamation} className='text-3xl text-[#ff4500]' />
          </div>

          {/* Message */}
          <div>
            <h2 className='text-xl font-bold text-[#d7dadc] mb-2'>Something went wrong</h2>
            <p className='text-[#818384] text-sm leading-relaxed'>
              This post may have been removed, deleted, or the link you followed is no longer valid. 
              Please check the URL or head back to the homepage.
            </p>
          </div>

          {/* Actions */}
          <div className='flex gap-3 mt-2'>
            <button 
              onClick={() => navigate(-1)}
              className='flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#343536] text-[#d7dadc] text-sm font-medium hover:bg-[#272729] transition-colors duration-200'>
              <FontAwesomeIcon icon={faArrowLeft} className='text-xs' />
              Go Back
            </button>
            <button 
              onClick={() => navigate('/')}
              className='px-5 py-2.5 rounded-full bg-[#ff4500] text-white text-sm font-semibold hover:bg-[#e03d00] transition-colors duration-200'>
              Homepage
            </button>
          </div>
        </div>
      </div>
    )
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