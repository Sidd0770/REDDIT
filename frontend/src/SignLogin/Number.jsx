import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft,faXmark } from '@fortawesome/free-solid-svg-icons'

const Number = () => {
    const submitNumber = () => {

    }
  return (
    
    <div className='w-screen h-screen z-20 flex items-center justify-center absolute top-0 left-0' style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
        <div className='flex flex-col self-center justify-between  text-white bg-black w-[40%] mx-4 p-5 border border-gray-700 rounded-[2rem] h-[80%]'>
            
            <div className='flex justify-between '>
                <div>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
                <div>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
            <h1>
                Sign Up or Login with the <br></br> Phone Numeber
            </h1>

            <input
                className=''
                placeholder='Phone Number'
                type='submit'
                maxLength={10}
                minLength={10}
                onClick={submitNumber}
            />
        </div>
    </div>
  )
}

export default Number