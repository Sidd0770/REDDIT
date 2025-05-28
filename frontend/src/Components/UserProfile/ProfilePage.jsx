import React from 'react'
import { useParams } from 'react-router-dom';
import AvtarUserName from './AvtarUserName';
import NavigationBar from './NavigationBar';

const ProfilePage = () => {
    const {username}=useParams();
    console.log(username);

  return (
    <div>
        <AvtarUserName username={username}/>
        <NavigationBar/>
          
    </div>
  )
}

export default ProfilePage 