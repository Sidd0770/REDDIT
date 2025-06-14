import React from 'react'
import { useState } from 'react'
import { createPost } from '../../services/operations/postsAPI';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const CreatePosts = () => {
    //get th link to navigate once task in completed
    const location=useLocation();
    const {Link}=location.state;
    console.log(Link);
    const navigate=useNavigate();
    const [type,setType]=useState('text');
    const [title,setTitle]=useState('');
    const [desc,setDesc]=useState("");
    const [image,setImage]=useState(null);
    const [link,setLink]=useState("");
    const [subreddit,setSubreddit]=useState("");
    const handleImageChange = (e) => {
        // e.target.files is a FileList, we want the first (and only) file
        setImage(e.target.files[0]);
    };

    const SubmitForm=async()=>{
        const formData=new FormData();
        formData.append('title',title)
        formData.append('subreddit',subreddit);
        formData.append('desc',desc);
        formData.append('link',link);
        formData.append('rootID',null);
        formData.append('parentID',null);
        if(image!=null){
            console.log("image is not null");
            formData.append('postImage', image);
        }else{
            console.log("image is null");
        }

        createPost(formData)
        .then(()=>{
            setTitle("");
            setSubreddit("");
            setDesc("");
            setImage(null);
            setLink("");
            navigate(Link);
        })
  
    }

  return (
    //   <div className='w-screen h-screen z-10 flex items-center justify-center absolute top-0 left-0' style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
    //   <div className='flex flex-col self-center justify-between  text-white bg-black w-[40%] mx-4 p-5 border border-gray-700 rounded-[2rem] h-[80%]'>
    <div className='border-2 w-screen h-screen z-10 border-amber-400  w-screen h-screen z-10 text-white'  style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
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
                <input type='file' name="postImage" placeholder='image and videos ' onChange={handleImageChange} className='w-[50%] text-white  p-2 border-2 border-black rounded-lg hover:border-green-300'
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