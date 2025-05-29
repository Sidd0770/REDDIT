import React from 'react'

const AvtarUserName = (props) => {
    
  return (
    <div>
        <div className="flex h-[25vh]">
            {/* avatar link */}

            <div>
                {props.username}
            </div>

        </div>

    </div>
  )
}

export default AvtarUserName