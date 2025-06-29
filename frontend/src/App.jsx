import './App.css'
import { useState } from 'react'
import Header from './Components/header'
import AuthorLogin from './Components/AuthorLogin'
import AuthorSignup from './Components/AuthorSignup'
import Homepage from './Components/Posts/Homepage'
import Post from './Components/Posts/Post'
import PostListing from './Components/Posts/PostListing'
import { BrowserRouter,Router,Route, Routes } from 'react-router-dom'
import Sidebar from './Components/Sidebar'
import CreatePosts from './Components/Posts/CreatePosts'
import PostPage from './Components/Posts/PostPage'
import SearchPage from './Components/SearchPage'
import {useEffect } from 'react'
import {useDispatch} from 'react-redux'
import {GetDataFromCookie} from './services/operations/authAPI'
import { setUser,setLogin,setUserId} from './services/Slices/loginSlice'
import Subreddit from './Components/Posts/Subreddit'
import ProfilePage from './Components/UserProfile/ProfilePage'
import CustomFeeds from './Components/NavigationPanel/CustomFeeds'
import Trending from './Components/NavigationPanel/Trending'
import Moredetails from './Components/UserProfile/Moredetails'
import OTPVerification from './Components/OTPverification'

function App() {
  const [login,setlogin]=useState(false);
  const [signup,setsignup]=useState(false);
  const dispatch=useDispatch();

  useEffect(()=>{
      GetDataFromCookie()
      .then((data)=>{
        console.log(data);
        dispatch(setUser(data.username));
        dispatch(setUserId(data.id));
        dispatch(setLogin(true));
      })
      .catch((error)=>{
        console.log(error);
      })
    
  })

  // console.log("location ",location);
  return (
    <div className='overflow-y-auto '>
      <Header  setlogin={setlogin}/>
      {
        login ?(
          <AuthorLogin setlogin={setlogin} setsignup={setsignup}  />
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
      {/*  */}

      <div className='flex m-1 w-[100vw] '>
        
        {/* PANEL */}
        <div className=' w-[15rem] '>
          <Sidebar/>
        </div>

        {/* MAIN CONTENT */}
        <div className='w-[50rem]  m-1 border-l-1 border-r-1 p-5 border-white'>
          <Routes>
           
            <Route path="/" element={<Homepage/>}/>
            <Route path="/post" element={<Post/>}/>
            <Route path="/editpost" element={<PostListing/>}/>
            <Route path="/createpost" element={<CreatePosts/>}/>
            <Route path="/createpost" element={<CreatePosts/>}/>
            <Route path="/posts/:id" element={<PostPage/>}/>
            <Route path="/r/:subreddit" element={<Subreddit/>}/>
            <Route path="/search/:keyword" element={<SearchPage/>}/>
            <Route path="/profile/:username" element={<ProfilePage/>}/>
            <Route path="/feed/:username" element={<CustomFeeds/>}/>
            <Route path="/Popular" element={<Trending/>}/>
          </Routes>
        </div>

        {/* RECENTLY VISITED SUBREDDITS   */}
        <div className='mx-5 bg-amber-500 w-[17rem]'>
          {/* <Routes>
              <Route path="/" />
              <Route path="/profile/:username" element={<Moredetails/>}/>
          </Routes> */}
        </div>
        
      </div>

       
    </div>


  )
}

export default App
