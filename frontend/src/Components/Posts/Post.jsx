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

  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

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

  const handleUpvote = () => {
    if (upvoted) {
      setVoteCount(voteCount - 1);
      setUpvoted(false);
    } else {
      setVoteCount(downvoted ? voteCount + 2 : voteCount + 1);
      setUpvoted(true);
      setDownvoted(false);
    }
    upvotePost(ID);
  };

  const handleDownvote = () => {
    if (downvoted) {
      setVoteCount(voteCount + 1);
      setDownvoted(false);
    } else {
      setVoteCount(upvoted ? voteCount - 2 : voteCount - 1);
      setDownvoted(true);
      setUpvoted(false);
    }
    downvotePost(ID);
  };

  const Upperbody=()=>{
    return(
      <div>
        {
            type === "homepage" ?
            (
              <div>                 
                <Link to={`/r/${props.subreddit}`} state={{postID:props.subreddit}}
                  className='text-xs font-semibold text-[#ff4500] hover:underline'>
                  r/{props.subreddit}
                </Link>
              </div>
            )
            :
            (
              <div >
                
                <div className='flex justify-between items-center'>
                  <div className='text-xs text-[#818384]'>
                    <Link to={`/r/${props.subreddit}`} state={{postID:props.subreddit}}
                          className='font-semibold text-[#ff4500] hover:underline'>
                      r/{props.subreddit}
                    </Link>
                    <span className='mx-1'>•</span>
                    <span>Posted by u/{props.author}</span>
                  </div>
                  <div>
                      { mod 
                          &&
                        <button className='p-2 rounded-full text-[#818384] hover:text-[#ff4500] hover:bg-[#ff450015] transition-colors duration-200' 
                        onClick={(e)=>{e.preventDefault(); e.stopPropagation(); DELETE();}}>
                            <FontAwesomeIcon icon={faTrash} className='text-sm' />
                        </button> 
                      }
                  </div>
                </div>
                
              </div>
            )
          }

      </div>
    )
    
  }

  const Lowerbody=()=>{
    return (
      <div className='flex items-center gap-1 mt-2 -ml-1'>
          <button onClick={handleUpvote}
            className={`p-1.5 rounded-full transition-colors duration-200 flex items-center gap-1 text-sm ${upvoted ? 'text-[#ff4500]' : 'text-[#818384] hover:text-[#d7dadc] hover:bg-[#272729]'}`}>
              <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <span className={`text-xs font-semibold min-w-[20px] text-center ${upvoted ? 'text-[#ff4500]' : downvoted ? 'text-[#5a75cc]' : 'text-[#d7dadc]'}`}>
            {voteCount}
          </span>
          <button onClick={handleDownvote}
            className={`p-1.5 rounded-full transition-colors duration-200 flex items-center gap-1 text-sm ${downvoted ? 'text-[#5a75cc]' : 'text-[#818384] hover:text-[#d7dadc] hover:bg-[#272729]'}`}>
              <FontAwesomeIcon icon={faArrowDown} />
          </button>
          <button className='ml-2 px-3 py-1.5 rounded-full text-[#818384] hover:text-[#d7dadc] hover:bg-[#272729] transition-colors duration-200 flex items-center gap-1.5 text-xs font-semibold'
                onClick={()=>{
                      props.open=true
                }}
          >
              <FontAwesomeIcon icon={faComment} />
              <span>Comments</span>
          </button>
            
      </div>
    )
  }

  const PostStructure=()=>{
    const isDeleted = desc === '[DELETED]';
    return(
     <div className='mt-2'>
          {
            login && <AuthorLogin/>
          }
          {/*  subreddit and the username */}

          <h2 className='text-lg font-semibold text-[#d7dadc] leading-snug'>{props.title}</h2>
          <div className={`text-sm leading-6 mt-1 ${isDeleted ? 'text-[#6a6c6e] italic' : 'text-[#d7dadc]/80'}`}>
            <p>{desc}</p>
          </div>
          {
            props.image &&
              <div className="my-3 rounded-xl overflow-hidden">
                  <img src={props.image} className="w-full h-auto rounded-xl" />
              </div>
          }
          
      </div>
    )     
  }

  return (
    <div className='animate-fade-in'>
        {
          props.open ?
          (
              <div className='bg-[#1a1a1b] border border-[#343536] rounded-xl p-4 hover:border-[#d7dadc33] transition-all duration-200'>
                <Upperbody/>
                <PostStructure/>
                <Lowerbody/>
                <div className='mt-4 pt-4 border-t border-[#343536]'>
                  <CommentForm rootID={ID} parentID={ID} subreddit={props.subreddit} onSubmit={handleCommentSubmit}/>
                  <CommentListing rootID={ID} parentID={ID} subreddit={props.subreddit} newCommentAdded={newCommentAdded}/>
                </div>
              </div>  
          ):(
              <div className='bg-[#1a1a1b] border border-[#343536] rounded-xl p-4 hover:border-[#d7dadc33] transition-all duration-200 cursor-pointer'>
                  <Upperbody/>
                  <Link to={{pathname:`/posts/${props._id}`,state:{postID:props._id}}} className='block'>
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