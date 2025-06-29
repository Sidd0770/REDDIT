import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp,faArrowDown,faComment,faTrash} from '@fortawesome/free-solid-svg-icons';
import { useState,useCallback } from 'react';
// import { useSelector} from 'react-redux';
import {downvotePost,upvotePost} from '../../services/operations/postsAPI';
import AuthorLogin from '../AuthorLogin';
import CommentListing from '../Comments/CommentListing';
import CommentForm from '../Comments/CommentForm';
import {deletePost} from '../../services/operations/postsAPI';

const Post = (props) => {
  // const loggedin=useSelector(state=>state.isLogin);
  const vote=props.votes;
  const ID=props._id;
  const [voteCount,setVoteCount]=useState(vote);
  const [login,SetLogin]=useState(false);
  const type =props.type;
  const mod=props.moderator;
  const [desc,setDesc]=useState(props.desc);
  // const [open,setOpen]=useState(props.open);

  const [newCommentAdded,setNewCommentAdded]=useState(0);     //open the commentForm
      
  const handleCommentSubmit=useCallback(()=>{
      setNewCommentAdded(prev=>prev+1);
      console.log(newCommentAdded);        
  },[]);
  
  const DELETE =()=>{  
      deletePost(ID)
      .then((res)=>{  
      
        setDesc(res.data.data.desc);
      })
  }

  const Upperbody=()=>{
    return(
      <div className=''>
        {
            type === "homepage" ?
            (
              <div>                 
                <Link to={{pathname:`/r/${props.subreddit}`,state:{postID:props.subreddit}}} className='text-sm '> u/{props.subreddit}</Link>
              </div>
            )
            :
            (
              <div >
                
                <div className='flex justify-between items-center'>
                  <div className='text-sm'>
                    <h3 className='text-sm'> u/{props.subreddit}</h3>
                    Posted by u/{props.author}

                  </div>
                  <h5>
                      { mod 
                          &&
                        <button className='px-3 py-2 rounded-full hover:scale-[120%] hover:cursor-pointer ' 
                        onClick={()=>{DELETE();}}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button> 
                      }
                  </h5>
                </div>
                
              </div>
            )
          }

      </div>
    )
    
  }

  const Lowerbody=()=>{
    return (
      <div className='flex my-4'>
          <button onClick={()=>{
                        setVoteCount(voteCount+1);
                        upvotePost(ID);
          }} className=' m-1  rounded-full w-[3rem] h-[2rem] flex justify-center items-center hover:scale-110'>
              <FontAwesomeIcon  icon={faArrowUp} />
              <p className='m-2'>{voteCount}</p>
          </button>
          <button onClick={()=>{
                        setVoteCount(voteCount-1);
                        downvotePost(ID);
          }}  className='m-1 rounded-full w-[3rem] h-[2rem] flex justify-center items-center hover:scale-110'>
              <FontAwesomeIcon icon={faArrowDown} />

          </button>
          <button className='m-1 rounded-full w-[3rem] h-[2rem]  flex justify-center items-center hover:scale-110'
                onClick={()=>{
                      props.open=true
                }}
          >
                
              <FontAwesomeIcon icon={faComment} />
          </button>
            
      </div>
    )
  }

  const PostStructure=()=>{
    return(
     <div>
          {
            login && <AuthorLogin/>
          }
          {/*  subreddit and the username */}

          <h2 className='text-xl m-2'>{props.title}</h2>
          <div className='text-sm leading-6'>
            <p>{desc}</p>
          </div>
          {
            props.image &&
              <div className="my-2">
                  <img src={props.image} className="w-full h-full rounded-lg" />
              </div>
          }
          
      </div>
    )     
  }
  const postclasses="block p-2 rounded-lg hover:bg-gray-100 " + (props.open ?"":"cursor-pointer") ;
  return (
    <div className='my-7 w-[65%] mx-4'>
        {
          props.open ?
          (
              <div className={postclasses}>
                <Upperbody/>
                <PostStructure/>
                <Lowerbody/>
                <CommentForm rootID={ID} parentID={ID} subreddit={props.subreddit} onSubmit={handleCommentSubmit}/>
                <CommentListing rootID={ID} parentID={ID} subreddit={props.subreddit} newCommentAdded={newCommentAdded}/>
              </div>  
          ):
          (
              <div>
                  <Upperbody/>
                  <Link to={{pathname:`/posts/${props._id}`,state:{postID:props._id}}} className={postclasses}>
                      <PostStructure/>
                  </Link>
                  <Lowerbody/>
              </div>  
              
          )
        }
    </div>
  )
}

export default Post