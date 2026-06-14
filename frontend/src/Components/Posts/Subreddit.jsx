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
    <div>
      
      {/* Banner */}
      <div className='w-full h-[8rem] rounded-t-xl bg-gradient-to-r from-[#ff4500] to-[#ff8717]'></div>

      {/* Subreddit Info Bar */}
      <div className='relative flex items-end px-4 pb-3 pt-4 bg-[#1a1a1b] rounded-b-xl border border-t-0 border-[#343536]'>
          
          {/* Avatar */}
          <div className='absolute -top-8 left-5 w-[72px] h-[72px] rounded-full bg-[#0e1113] border-4 border-[#1a1a1b] flex items-center justify-center'>
            <span className='text-2xl font-bold text-[#ff4500]'>{subreddit?.charAt(0)?.toUpperCase()}</span>
          </div>

          {/* Name */}
          <div className='ml-[88px] mr-8'>
            <h1 className='text-xl font-bold text-[#d7dadc]'>r/{subreddit}</h1>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-3 ml-auto'>
              <button className='flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#343536] text-[#d7dadc] text-sm font-medium hover:bg-[#272729] transition-colors duration-200'
                      onClick={createPostFunction}>
                <FontAwesomeIcon icon={faPlus} className='text-xs' />
                Create
              </button>

              <button className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                join 
                  ? 'bg-[#272729] text-[#d7dadc] border border-[#343536] hover:bg-[#343536]' 
                  : 'bg-[#ff4500] text-white hover:bg-[#e03d00]'
              }`}
                onClick={()=>Join(subreddit)}
                >
                {join ? "Joined":"Join"}  
                </button>

              <button className='p-2 rounded-full text-[#818384] hover:bg-[#272729] hover:text-[#d7dadc] transition-colors duration-200'>
                <FontAwesomeIcon icon={faBars} />
              </button>
          </div>
      </div>

      {/* Posts */}
      <div className='mt-4'>
        <PostListing subreddit={subreddit}/>
      </div>

      </div>        
    
  )
}

export default Subreddit