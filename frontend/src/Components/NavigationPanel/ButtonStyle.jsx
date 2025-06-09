export const ButtonStyle=({name,fun})=>{
  return(
    <div onClick={fun} className='text-black p-2 hover:bg-[#2A3236] hover:text-white rounded-md pl-[4vw] onhover:bg-[#2A3236] cursor-pointer'>
      {name}
    </div>
  );
};