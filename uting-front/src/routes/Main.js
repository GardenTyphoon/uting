import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyProfile from '../components/MyProfile';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import RoomListForm from '../components/room/RoomListForm'
const Main = () => {

  const [toggleprofile,setToggleProfile]=useState(false);


  const toggleProfile = (e) => setToggleProfile(!toggleprofile);
  
 
  return (
    <div>
      <h5>메인</h5>
      <button onClick={(e)=>{toggleProfile(e)}}>my프로필</button>
      <Collapse isOpen={toggleprofile}>
        <Card>
          <CardBody>
            {toggleprofile===true?<MyProfile></MyProfile>:""}
          </CardBody>
        </Card>
      </Collapse>
      <RoomListForm />
    </div>
  );
};
export default Main;