import React,{useState,useEffect} from 'react'
import { getComments } from '../../services/operations/commentAPI';
import Comment from './Comment';

const CommentListing = (props) => {
  const rootID=props.rootID;
  const parentID=props.parentID;
  const newComment=props.newCommentAdded;
  console.log(newComment);
  const [comments,setComments]=useState([]);

  useEffect(()=>{
      getComments(rootID,parentID)
      .then((response)=>{
          console.log(response);
          setComments(response);
      })
      
  },[newComment]);

  
  return (
    <div>
      {comments.map((comment)=>(
          <Comment {...comment} key={comment._id}/>
      ))
      }
    </div>
  )
}

export default CommentListing