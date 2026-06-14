import React from 'react'
import logo from   '../assets/redditimage.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass,faComment,faPlus,faBell,faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
// import avatar from '../assets/avatr.jpg'
import { useState,useEffect,useRef } from 'react';
import { useSelector,useDispatch} from 'react-redux';
import {setUser,setLogin} from '../services/Slices/loginSlice';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = ({setlogin}) => {
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(false);
  // const handleOutsideClick=useOutsideAlerter();
  const dispatch=useDispatch();
  const isLogin=useSelector(state=>state.isLogin);
  const person=useSelector(state=>state.user);

  const link ='/';
  const navigate=useNavigate();

  const createPostFunction=()=>{
      navigate('/createpost',{state:{Link:link}});
  }
  
  const[userDropDownVisible, setUserDropDownVisible] = useState(false);
  // handleOutsideClick(ref,setUserDropDownVisible);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setUserDropDownVisible(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const loginpage = () => {
    setlogin(true);
  }

  const userDropDownRef = useRef(null);
  useOutsideAlerter(userDropDownRef);

  const toggleUserDropDown = () => { 
    setUserDropDownVisible((prev)=>!prev);
  }

  const SearchFunction=(e)=>{
    e.preventDefault();
    if(search!=''){
      navigate(`/search/${search}`,{state:{search:search}});
      setSearch('');
    }

  }

  //this removes the user data from the REdux toolkit
  const logout=()=>{  
      console.log("Logging out");
      dispatch(setLogin(false));
      dispatch(setUser(''));
  }
  
  //navigate to the user page
  const UserPage=()=>{
    console.log("Navigating to user page");
    console.log(person);
    if(person){
      navigate(`/profile/${person}`,{state:{person:person}});
    }else{
      console.log("No user found");
    }
  }

  return (
    <div className='sticky top-0 z-50 flex justify-between items-center w-full px-5 py-2 bg-[#1a1a1b] border-b border-[#343536]'>
        <Link to="/" className='flex items-center gap-2'>
            <span className='text-xl font-bold text-[#ff4500] tracking-wide'>Content Recommendation</span>
        </Link>

        <form onSubmit={SearchFunction} className='flex-1 max-w-[560px] mx-6'>
          <div className='flex items-center bg-[#272729] rounded-full border border-[#343536] hover:border-[#d7dadc33] hover:bg-[#2a2a2c] transition-all duration-200 focus-within:border-[#d7dadc66] focus-within:bg-[#1a1a1b]'>
            <FontAwesomeIcon className='ml-4 text-[#818384] text-sm' icon={faMagnifyingGlass} />
            <input type='text' className='flex-1 h-10 px-3 bg-transparent text-[#d7dadc] text-sm placeholder-[#818384] focus:outline-none'
              placeholder='Search Reddit'
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>
            
        </form>

        {/* before sign up page */}

        <div className='flex items-center gap-1'>
            {
              isLogin ?(
                <>
                  <button className='p-2 rounded-full text-[#d7dadc] hover:bg-[#272729] transition-colors duration-200'>
                    <FontAwesomeIcon icon={faComment} className='text-lg' />
                  </button>

                  <button className='flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#343536] text-[#d7dadc] hover:bg-[#272729] transition-colors duration-200'
                          onClick={()=> createPostFunction()}>
                    <FontAwesomeIcon icon={faPlus} className='text-sm' />
                    <span className='text-sm font-medium hidden sm:inline'>Create</span>
                  </button>

                  <button className='p-2 rounded-full text-[#d7dadc] hover:bg-[#272729] transition-colors duration-200'>
                    <FontAwesomeIcon icon={faBell} className='text-lg' />
                  </button>

                  {/* username */}
                  <button onClick={toggleUserDropDown} ref={userDropDownRef} className='w-8 h-8 rounded-full bg-[#272729] flex items-center justify-center text-[#d7dadc] hover:bg-[#343536] transition-colors duration-200 ml-1'>
                    <FontAwesomeIcon icon={faUser} className='text-sm' />
                  </button>
                  
                  {/* user dropdown */}
                  {
                  userDropDownVisible &&
                  <div ref={userDropDownRef} className='flex flex-col p-2 absolute right-4 bg-[#1a1a1b] border border-[#343536] top-[52px] rounded-xl w-48 shadow-xl shadow-black/40'>
                    {
                      <div>
                        <button className='flex items-center w-full px-3 py-2 text-[#d7dadc] rounded-lg hover:bg-[#272729] transition-colors duration-200 text-sm font-medium'
                                onClick={()=>UserPage()}
                        >
                          <FontAwesomeIcon icon={faUser} className='mr-3 text-[#818384]' />
                          {person}
                        </button>
                    <button className="flex items-center w-full px-3 py-2 text-[#d7dadc] rounded-lg hover:bg-[#272729] transition-colors duration-200 text-sm"
                            onClick={()=>logout()}
                      >
                      <FontAwesomeIcon className="mr-3 text-[#818384]" icon={faRightToBracket}            
                      />
                      Log Out
                    </button>
                    </div>
                    }
                  </div>
                  }
                  

                </>
              ):
              (<>
                  <button onClick={loginpage}
                    className='px-5 py-2 bg-[#ff4500] hover:bg-[#e03d00] text-white font-semibold text-sm rounded-full transition-colors duration-200 shadow-lg shadow-[#ff4500]/20'>
                    Log In
                  </button>
              </>)
              
            }

        </div>
    </div>
  )
}

export default Header
