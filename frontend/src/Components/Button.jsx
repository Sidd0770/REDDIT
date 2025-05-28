import React from 'react'

const Button = ({color, name}) => {
  return (
    <div className='p-2 items-center bg-{color} rounded-full text-white text-[70%] hover:scale-105 ' style={ {backgroundColor: color}}>
        {name}
    </div>
  )
}

export default Button