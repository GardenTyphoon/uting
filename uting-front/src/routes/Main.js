import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyProfile from '../components/profile/MyProfile';
import { Button,Collapse, CardBody, Card,  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Meeting from "../components/meeting/Meeting";
import MeetingListForm from '../components/meeting/MeetingListForm'
const Main = () => {
  
  const [toggleprofile,setToggleProfile]=useState(false);
  const [toggleMakeMeeting, setToggleMakeMeeting]=useState(false);

  const toggleProfileBtn = (e) => setToggleProfile(!toggleprofile);
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);
  
 
  return (
    <div>
      <h5>메인</h5>
      <button onClick={(e)=>{toggleProfileBtn(e)}}>my프로필</button>
      <Collapse isOpen={toggleprofile}>
        <Card>
          <CardBody>
            {toggleprofile===true?<MyProfile></MyProfile>:""}
          </CardBody>
        </Card>
      </Collapse>
      <MeetingListForm />

      <button onClick={(e)=>{toggleMakeMeetingBtn(e)}}>방만들기</button>
      <Modal isOpen = {toggleMakeMeeting}>
        <ModalBody isOpen = {toggleMakeMeeting}>
            <Meeting />
        </ModalBody>
        <ModalFooter isOpen = {toggleMakeMeeting}>
          <Button color="primary" >Do Something</Button>{' '}
          <Button color="secondary" onClick = {toggleMakeMeetingBtn}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default Main;