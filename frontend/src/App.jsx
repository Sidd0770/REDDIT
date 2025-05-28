import './App.css'
import { useState } from 'react'
import Header from './Components/header'
import AuthorLogin from './Components/AuthorLogin'
import AuthorSignup from './Components/AuthorSignup'
// import Banner from './Components/Posts/Subreddit'
import Homepage from './Components/Posts/Homepage'
import NewPost from './Components/Posts/NewPosts'
import Post from './Components/Posts/Post'
import PostListing from './Components/Posts/PostListing'
import { BrowserRouter,Router,Route, Routes } from 'react-router-dom'
import Sidebar from './Components/Sidebar'
import CreatePosts from './Components/Posts/CreatePosts'
import PostPage from './Components/Posts/PostPage'
import SearchPage from './Components/SearchPage'
import { useEffect } from 'react'
import { useDispatch} from 'react-redux'
import {GetDataFromCookie} from './services/operations/authAPI'
import { setUser,setLogin,setUserId} from './services/Slices/loginSlice'
import Subreddit from './Components/Posts/Subreddit'
import ProfilePage from './Components/UserProfile/ProfilePage'

function App() {
  const [login,setlogin]=useState(false);
  const [signup,setsignup]=useState(false);
  const dispatch=useDispatch();

  useEffect(()=>{
      GetDataFromCookie()
      .then((data)=>{
        console.log(data);
        dispatch(setUser(data.username));
        dispatch(setUserId(data._id));
        dispatch(setLogin(true));
      })
      .catch((error)=>{
        console.log(error);
      })
    
  })

  // console.log("location ",location);
  return (
    <div className='overflow-hidden '>
      <Header  setlogin={setlogin}/>
      {
        login ?(
          <AuthorLogin setlogin={setlogin} setsignup={setsignup} />
        ):
        (<></>)
      }
      {
        signup ?(
          <AuthorSignup setlogin={setlogin} setsignup={setsignup} />
        ):
        (<></>)
      }

      {/* LAYOUT OF THE MAIN MENU */}

      <div className='flex m-1 w-[100vw] '>
        
        {/* PANEL */}
        <div className=' w-[15rem] '>
          <Sidebar/>
        </div>
        
        

        {/* MAIN CONTENT */}
        <div className='w-[50rem]  m-1 border-l-1 border-r-1 p-5 border-white'>
          <Routes>
           
            <Route path="/" element={<Homepage/>}/>
            {/* <Route path="/banner" element={<Banner/>}/> */}
            <Route path="/post" element={<Post/>}/>
            <Route path="/editpost" element={<PostListing/>}/>
            <Route path="/createpost" element={<CreatePosts/>}/>
            <Route path="/createpost" element={<CreatePosts/>}/>
            <Route path="/posts/:id" element={<PostPage/>}/>
            <Route path="/r/:subreddit" element={<Subreddit/>}/>
            <Route path="/search/:keyword" element={<SearchPage/>}/>
            <Route path="/profile/:username" element={<ProfilePage/>}/>
            
          </Routes>
        </div>

        {/* RECENTLY VISITED SUBREDDITS   */}
        <div className='mx-5 bg-amber-50 w-[17rem]'>
          
        </div>
        
      </div>

       
    </div>


  )
}

export default App
