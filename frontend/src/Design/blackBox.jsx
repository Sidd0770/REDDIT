import React from 'react'

const blackBox = () => {
  // This component renders a black box overlay with a semi-transparent background.
  return (
    <div className='w-screen h-screen z-20 flex items-center justify-center absolute top-0 left-0' style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
        <div className='flex flex-col self-center justify-between  text-white bg-black w-[40%] mx-4 p-5 border border-gray-700 rounded-[2rem] h-[80%]'>
        </div>
    </div>
  )
}

export default blackBox