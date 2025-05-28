import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp,faArrowDown,faComment} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useSelector} from 'react-redux';
import {changeVotes} from '../../services/operations/postsAPI';
import AuthorLogin from '../AuthorLogin';
import CommentListing from '../Comments/CommentListing';
import CommentForm from '../Comments/CommentForm';

const Post = (props) => {
  const loggedin=useSelector(state=>state.isLogin);
  const vote=props.votes;
  const ID=props._id;
  const [voteCount,setVoteCount]=useState(vote);
  const [login,SetLogin]=useState(false);
  const type =props.type;
  // const [open,setOpen]=useState(props.open);
  
  const changeVote=()=>{
      if(loggedin){
        changeVotes(ID,voteCount)
      }
      else{
        SetLogin(true);
    }
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
            (<div>
              {/* <h3 className='text-sm'> u/{props.subreddit}</h3> */}
              <h5 className='text-sm'>Posted by u/{props.author}</h5>
            </div>)
          }

      </div>
    )
    
  }

  const Lowerbody=()=>{
    return (
      <div className='flex my-4'>
          <button onClick={()=>{
                        setVoteCount(voteCount+1);
                        changeVote(ID,voteCount);
          }} className=' m-1  rounded-full w-[3rem] h-[2rem] flex justify-center items-center hover:scale-110'>
              <FontAwesomeIcon  icon={faArrowUp} />
              <p className='m-2'>{voteCount}</p>
          </button>
          <button onClick={()=>{
                        setVoteCount(voteCount-1);
                        changeVote(ID,voteCount);
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
            <p>{props.desc}</p>
          </div>
          
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
                <CommentForm rootID={ID} parentID={ID} />
                <CommentListing rootID={ID} parentID={ID}/>
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