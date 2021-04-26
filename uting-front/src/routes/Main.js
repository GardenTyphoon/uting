import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import MyProfile from '../components/profile/MyProfile';
import { Button,Collapse, CardBody, Card,  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Meeting from "../components/meeting/Meeting";
import MeetingList from '../components/meeting/MeetingList'
import Groups from '../components/group/Groups'
import './Main.css'
const Main = () => {
  const history = useHistory();
  const [toggleprofile,setToggleProfile]=useState(false);
  const [toggleMakeMeeting, setToggleMakeMeeting]=useState(false);
  const toggleProfileBtn = (e) => setToggleProfile(!toggleprofile);
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);
  
  let sessionUser = sessionStorage.getItem('email');

  const gotoAdminPage = () => {
    history.push({
      pathname: `/admin`
    })
  }
  return (
    <div className="mainContainer">
      <h5>메인</h5>
      {sessionUser === "admin@ajou.ac.kr" ? <button onClick={gotoAdminPage}>관리자페이지</button> : ""}
      <button onClick={(e)=>{toggleProfileBtn(e)}}>my프로필</button>
      <Collapse isOpen={toggleprofile} style={{width:"40%"}}>
        <Card style={{border:"0px"}}>
          <CardBody style={{padding:"0%"}}>
            {toggleprofile===true?<MyProfile></MyProfile>:""}
          </CardBody>
        </Card>
      </Collapse>

      <button onClick={(e)=>{toggleMakeMeetingBtn(e)}}>방만들기</button>
      <Modal isOpen = {toggleMakeMeeting}>
        <ModalBody isOpen = {toggleMakeMeeting}>
            <Meeting />
        </ModalBody>
        <ModalFooter isOpen = {toggleMakeMeeting}>
          <Button color="secondary" onClick = {toggleMakeMeetingBtn}>Close</Button>
        </ModalFooter>
      </Modal>
      <MeetingList/>
      <Groups ></Groups>
    </div>
  );
};
export default Main;