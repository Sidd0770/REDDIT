import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ButtonStyle=({name,fun,icon})=>{
  return(
    <div onClick={fun} className='flex items-center gap-3 text-[#d7dadc] px-4 py-2.5 rounded-lg hover:bg-[#272729] cursor-pointer transition-colors duration-200 text-sm font-medium'>
      {icon && <FontAwesomeIcon icon={icon} className='w-5 text-[#818384]' />}
      {name}
    </div>
  );
};