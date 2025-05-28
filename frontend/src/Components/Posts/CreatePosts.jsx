import React from 'react'
import { useState } from 'react'
import { createPost } from '../../services/operations/postsAPI';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const CreatePosts = () => {
    //get th link to navigate once task in completed
    const location=useLocation();
    const {Link}=location.state;
    console.log(Link);
    const navigate=useNavigate();

    const author=useSelector((state)=>state.user);
    console.log(author);
    const [type,setType]=useState('text');
    const [title,setTitle]=useState('');
    const [desc,setDesc]=useState("");
    const [image,setImage]=useState("");
    const [link,setLink]=useState("");
    const [subreddit,setSubreddit]=useState("");
    

    const SubmitForm=()=>{
        createPost({author,title,subreddit,desc,image,link,rootID:null,parentID:null})
        .then(()=>{
            setTitle("");
            setSubreddit("");
            setDesc("");
            setImage("");
            setLink("");
            navigate(Link);
        })
  
    }
    

  return (
    <div className='border-2 border-amber-400  w-screen h-screen z-10 text-white'  style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
        <div className='flex  justify-between m-7' >
            <h1 className='text-xl'> create post</h1>
            <button>Drafts</button>
        </div>

        <div className='flex m-2'>
              <button className='m-2 border-2 rounded-2xl p-2' onClick={()=>setType('text')}>Text</button>
              <button className='m-2 border-2 rounded-2xl p-2' onClick={()=>setType('image')}>Image&Video</button>
              <button className='m-2 border-2 rounded-2xl p-2' onClick={()=>setType('link')}>Link</button>
              <button className='m-2 border-2 rounded-2xl p-2' onClick={()=>setType('poll')}>Poll</button>
        </div>

        <div className='ml-6'>
            <input placeholder="subreddit" required className='w-[50%]  p-2 border-2 border-black rounded-lg hover:border-green-300' 
                onChange={(e)=>setSubreddit(e.target.value)}
            />
        </div>

        <div className='m-6'> 
            <input placeholder='Title' required className='w-[50%]  p-2 border-2 border-black rounded-lg hover:border-green-300'
                onChange={(e)=>setTitle(e.target.value)}
            />   
        </div>
        
        <div className='mx-6'>
            
            {
                type==='text' &&
                <textarea placeholder='text' className='w-[50%]  p-2 border-2 border-black rounded-lg hover:border-green-300'
                        onChange={(e)=>setDesc(e.target.value)}
                >
                </textarea>
            }
            {
                type==='image' &&
                <input type='file' placeholder='image and videos ' onChange={(e)=>setImage(e.target.value)} className='w-[50%] text-white  p-2 border-2 border-black rounded-lg hover:border-green-300'
                />
            }
            {
                type==='link' &&
                <input placeholder='link' className='w-[50%]  p-2 border-2 border-black rounded-lg hover:border-green-300'
                    onChange={(e)=>setLink(e.target.value)}
                />
            }
        </div>

        <div className='flex  text-white'>
            <button  className='bg-blue-500 p-2 m-2 rounded-lg text-white hover:bg-orange-300'>
                    Save Draft
            </button>
            <button onClick={SubmitForm} className='bg-blue-500 p-2 m-2 rounded-lg text-white  hover:bg-orange-300'>
                    Post
            </button>

        </div>
        
    </div>
  )
}



export default CreatePosts