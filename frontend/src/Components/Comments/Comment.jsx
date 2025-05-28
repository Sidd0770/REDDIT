import React, { useCallback, useState } from 'react'
import {format} from 'timeago.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp, faArrowDown, faComment} from '@fortawesome/free-solid-svg-icons';
import { changeVotes } from '../../services/operations/postsAPI';
import { useSelector } from 'react-redux';
import CommentForm from './CommentForm';
import CommentListing from './CommentListing';
 
const Comment = (props) => {
    const rootID=props.rootID;   //this is rootID of the comment
    const ID=props._id;          //this is ID of the comment
    const vote = props.votes;
    const loggedin=useSelector(state=>state.isLogin);
    const [login,SetLogin]=useState(false);           //person commenting without login
    const [voteCount, setVoteCount] = useState(vote); //counts the votes of the comment  
    const [comment,setComment]=useState(false);       //open the commentForm
    const [newCommentAdded,setNewCommentAdded]=useState(0);     //open the commentForm
    
    const handleCommentSubmit=useCallback(()=>{
        setNewCommentAdded(prev=>prev+1);
        console.log(newCommentAdded);        
    },[]);

    const changeVote=()=>{  
          if(loggedin){
            changeVotes(ID,voteCount)
          }
          else{
            SetLogin(true);
        }
      }

  return (
    <div className='border-l-2 m-3'>
        {
            login &&  <AuthorLogin/>
        }

        {/* Author || date || Commentbody */}
        <div className='atext-black'>
            {/*  Add an Avatar  */}
             <div className='flex  items-center mt-3 mb-0.5'>   
                <p className='text-[15px] pl-2 mr-3'>/{props.author}</p>
                <p className='text-[15px] pl-2'>{format(props.createdAt)}</p>
             </div>
             <div className='text-m px-2 border-indigo-950 '>
                {props.desc}
             </div>
        </div>
        

        {/* UPVOTE || DOWNVOTE || COMMENT */}
        <div className='flex my-4'>
            <button onClick={()=>{
                            setVoteCount(voteCount+1);
                            changeVote(ID,voteCount);
            }} className=' border-1 border-gray-400 mx-1  rounded-full w-[3rem] h-[2rem] flex justify-center items-center hover:scale-110'>
                <FontAwesomeIcon  icon={faArrowUp} />
                <p className='m-2'>{voteCount}</p>
            </button>
            <button onClick={()=>{
                            setVoteCount(voteCount-1);
                            changeVote(ID,voteCount);
            }}  className=' border-1 border-gray-400 m-1 rounded-full w-[3rem] h-[2rem] flex justify-center items-center hover:scale-110'>
                <FontAwesomeIcon icon={faArrowDown} />

            </button>
            {/* this is the comments section */}
            <button onClick={()=>{
                setComment(!comment)
            }} 
                className=' border-1 border-gray-400 m-1 rounded-full w-[3rem] h-[2rem]  flex justify-center items-center hover:scale-110'>
                <FontAwesomeIcon icon={faComment} />
            </button>
            {
              comment && 
              <CommentForm 
                  rootID={props.rootID} 
                  parentID={props._id}
                  onSubmit={handleCommentSubmit} //pass the callback
              />
            }
 
        </div>
        <CommentListing 
            rootID={rootID} 
            parentID={ID}
            newCommentAdded={newCommentAdded}
        />
        
        
    </div>
  )
}

export default Comment