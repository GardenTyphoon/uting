import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyProfile from '../components/MyProfile';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import MeetingListForm from '../components/meeting/MeetingListForm'
import Groups from '../components/group/Groups'
const Main = () => {

  const [toggleprofile,setToggleProfile]=useState(false);


  const toggleProfile = (e) => setToggleProfile(!toggleprofile);
  
 
  return (
    <div style={{backgroundColor:"#ffe4e1"}}>
      <h5>메인</h5>
      <button onClick={(e)=>{toggleProfile(e)}}>my프로필</button>
      <Collapse isOpen={toggleprofile}>
        <Card>
          <CardBody>
            {toggleprofile===true?<MyProfile></MyProfile>:""}
          </CardBody>
        </Card>
      </Collapse>
      <MeetingListForm />
      <Groups ></Groups>
    </div>
  );
};
export default Main;