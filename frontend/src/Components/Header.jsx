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
    <div className='flex justify-between w-[99vw] p-3 relative'>
        <Link to={'/'} className='mx-4'>
            <img src={logo} className='h-10 ' alt='homepage'></img>
            
        </Link>
        <form onSubmit={SearchFunction}>
          <div className='flex items-center bg-gray-500 rounded-3xl'>
            <FontAwesomeIcon className='m-4' icon={faMagnifyingGlass} />
            <input type='text' className=' h-8 w-100   text-white focus:outline-none'
              placeholder='Search Reddit'
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </div>
            
        </form>

        {/* before sign up page */}
        {/* <Button></Button> */}

        <div className='flex justify-between items-center '>
            {
              isLogin ?(
                <>
                  <button className='justify-end mx-4'><FontAwesomeIcon icon={faComment} /></button>

                  <button className='flex border-2 p-2 rounded-xl hover:bg-gray-300'>
                    <div className='items-center'>
                      <FontAwesomeIcon  icon={faPlus} />
                    </div>
                    <div className='mx-2' onClick={()=> createPostFunction()}>Create</div>
                  </button>

                  <button className='mx-4 flex items-center'>
                    <FontAwesomeIcon icon={faBell} />
                  </button>
                </>
              ):(<>
                  <Button onClick={loginpage} className=''>Login In</Button>
              </>)
              
            }

            {/* username */}
            <button onClick={toggleUserDropDown} ref={userDropDownRef} className='w-7 h-7 rounded-full '>
              <div ><FontAwesomeIcon icon={faUser} /></div>
              {/* <img src={avatar} className='h-10 w-10 rounded-2xl'></img> */}
            </button>
            
            {/* user dropdown */}
            {
              userDropDownVisible &&

            <div className='flex flex-col p-1 absolute right-0 border-1 bg-black border-gray-700 top-11 rounded-sm w-40'>
              {
                isLogin &&
                <div onClick={()=>UserPage()}>
                  <button className='text-white m-1 hover:cursor-pointer'
                        
                  >
                      {person}
                  </button>
                </div>
                
              }
              
              <button className="flex justify-center text-sm hover:cursor-pointer text-white overflow-hidden p-1"
                      onClick={()=>logout()}
               >
                <FontAwesomeIcon className="w-6 h-6 mr-1 items-center" icon={faRightToBracket}            
                 />
                Log Out
              </button>
              
            </div>
            }
            

        </div>
    </div>
  )
}

function Button(props){
  const defaultStyle="border rounded-full p-2 bg-[#E64F17] text-white font-bold ";
  const afterStyle="hover:bg-amber-700";
  return(
    
    <button {...props} className={defaultStyle + props.className + afterStyle } />
  )
}

export default Header
