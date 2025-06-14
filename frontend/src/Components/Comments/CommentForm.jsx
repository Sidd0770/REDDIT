import React,{useState} from 'react'
import Button from '../Button.jsx'
import { faImage,faGift,faA} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createPost } from '../../services/operations/postsAPI.js'


//props mei hoga postid and parentid and username so pass the post it to the backend api call 
const CommentForm = (props) => {
    const [Text,setText]=useState('');
    const [image,setImage]=useState(null);
    const rootID=props.rootID;
    const parentID=props.parentID;
    const subreddit=props.subreddit;
    const onSubmit=props.onSubmit;
    console.log(parentID,rootID,subreddit);
    
    const ResetValues=()=>{
        setText('');
        setImage(null);
        
    }

    const handleSubmit=(e)=>{
        console.log(e);
        e.preventDefault();

        const formData =new FormData();

        formData.append('desc',Text);
        formData.append('rootID',rootID);
        formData.append('parentID',parentID);
        formData.append('subreddit',subreddit);
        if(image!=null){
            formData.append('postImage',image);
        }else{
            formData.append('postImage',null);
        }

        createPost(formData)
        .then(res=>{
            console.log(res);
            ResetValues();
            onSubmit();
        })
        .catch(err=>{
            console.log(err);
        })
        
        
    }
    

  return (
    <form onSubmit={handleSubmit} className='w-full bg-[#121212] rounded-xl'>
        {/* TEXT AREA OF THE COMMENT */}
        {/* <input type='text placeholder="add your comment" w-full rounded=xl p-1 bg-[#0B1416] text-white'
            onChange={(e)=>setText(e.target.value)}
        /> */}
        <textarea onChange={(e)=>setText(e.target.value)} value={Text} rows={3} cols={50}
            placeholder='add your comment' className='m-1 p-1 w-[99%] rounded-xl p-1 text-white'></textarea>

        <div className='flex justify-between items-center'>
            <div className='flex items-center justify-between'>
                {/* image upload */}
                <label
                    htmlFor="imageUpload" // Associate the label with the input using its ID
                    className="rounded-full hover:bg-[#1870F4] p-1 cursor-pointer" // Add padding and cursor styles
                    >
                    <FontAwesomeIcon size="sm" color="#FFFFFF" icon={faImage} />
                </label>
                <input
                    id="imageUpload" // Add an ID to the input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden" // Hide the actual file input
                />

                {/* gif upload */}
                <FontAwesomeIcon className='rounded-full mx-2 p-1 hover:bg-[#1870F4]' size="sm" color="#FFFFFF" icon={faGift} />
                
                {/* TEXT formating */}
                <FontAwesomeIcon className='rounded-full p-1 hover:bg-[#1870F4]' size="sm" color="#FFFFFF" icon={faA} />
            </div>
            <div className='flex items-center justify-end'>
                <button onClick={()=>ResetValues()} className='m-1'><Button color={'#223237'} name={'Cancel'}/></button>
                <button type='submit' className='m-1'><Button color={'#1870F4'} name={'Comment'}/></button>
                
            </div>
            
        </div>
    </form>
  )
}   

export default CommentForm