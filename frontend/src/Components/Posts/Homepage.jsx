import React from 'react'
import PostListing from './PostListing'

//props subreddit name ,images ,description ,posts
const Homepage = () => {
  return (
    <div className='overflow-hidden '>
        <PostListing type="homepage"/>
    </div>
  )
}

export default Homepage