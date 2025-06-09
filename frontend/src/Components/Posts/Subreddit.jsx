import React ,{ useState,useEffect}from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faBars} from '@fortawesome/free-solid-svg-icons';
import PostListing from './PostListing';
import { useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {joinSubreddit} from '../../services/operations/subredditAPI';
import {checkMember} from '../../services/operations/subredditAPI';


const Subreddit = () => {
  const {subreddit}=useParams();
  
  console.log(subreddit)
  const [join,setJoin]=useState(false);

  const link =`/r/${subreddit}`;
  
  const navigate=useNavigate();
  const createPostFunction=()=>{
      navigate('/createpost',{state:{Link:link}});
  }

  //take subreddit name from the url 
  

  useEffect(()=>{
    
      checkMember(subreddit)
      .then((data)=>{
        console.log("Check Member Data",data);
        if(data ===true){
          setJoin(true);
        }

      })
  }, [subreddit]
  )

  const Join =(subreddit)=>{
    console.log("Joining Subreddit",subreddit);
      joinSubreddit(subreddit)
      .then(()=>{
        console.log("Joined Subreddit Successfully");
        setJoin(true);
      })
  }
  

  return (
    <div className=''>
      
      <div className='w-full h-[8rem] rounded-t-lg bg-amber-400'></div>
      <div className=' relative flex flex-row h-[3rem] rounded-b-lg w-full'>
          <div>
            <div className='absolute flex rounded-full -top-14 left-4 bg-black h-[6rem] w-[6rem]  '></div>
            <div className='absolute left-26 top-[10%] text-3xl'>              
                r/{subreddit}        
            </div>

            <div className='flex  font-medium text-2xl items-center absolute right-40 top-2 m-1 '>
                <div className='flex p-2 mx-10 border-2 rounded-2xl items-center border-black hover:scale-105 hover:bg-amber-100'>  
                  <FontAwesomeIcon   icon={faPlus} />
                  <div className='mx-2 '  onClick={createPostFunction}>Create</div>
                </div >

                <button className='mx-2 hover:scale-105 bg-blue-200 px-3 py-1 rounded-2xl hover:bg-blue-300'
                  onClick={()=>Join(subreddit)}
                  >
                  {join ? "Joined":"Join"}  
                  </button>
                <div className='mx-4 hover:scale-105'>
                  <FontAwesomeIcon icon={faBars} />
                </div>
            </div>
          </div>  
      </div>

      <PostListing subreddit={subreddit}/>

      </div>        
    
  )
}

export default Subreddit