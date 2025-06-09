import React from 'react'
import Home from './NavigationPanel/Home'
import Moderation from './NavigationPanel/Moderation'
import CustomFeeds from './NavigationPanel/CustomFeeds'
import Recent from './NavigationPanel/Recent'
import Community from './NavigationPanel/Community'

const Sidebar = () => {
  return (
    <div className=''>
         <Home/>
         <Moderation/>
         <Community/>
    </div>
  )
}

export default Sidebar