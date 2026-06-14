import React from 'react'
import {ButtonStyle} from './ButtonStyle.jsx';
import { faShield } from '@fortawesome/free-solid-svg-icons';

const Moderation = () => {
  return (
    <div className='border-b border-[#343536] pb-2 mb-2'>
      <ButtonStyle name="Moderation" icon={faShield} />    
    </div>
  )
}

export default Moderation