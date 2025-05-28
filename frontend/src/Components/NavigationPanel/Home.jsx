import React from 'react'

const Home = () => {

  const home=()=>{
    
  }
  return (
    <div className='border-b-2'>
      <div className='flex flex-col mb-4  h-[20vh]'>
        <div>
          <ButtonStyle name="Home" fun="home"/>
        </div>
        <div>
          <ButtonStyle name="Popular"/>
        </div>
        <div>
          <ButtonStyle name="Explore"/>
        </div>
        <div>
          <ButtonStyle name="All"/>
        </div>
      </div>
      
    </div>
  )
}

const ButtonStyle=({name,fun})=>{
  return(
    <div onClick={()=>fun()} className='text-black  p-2 hover:bg-[#2A3236] hover:text-white rounded-md pl-[4vw] onhover:bg-[#2A3236] cursor-pointer'>
      {name}
    </div>
  );
};

export default Home