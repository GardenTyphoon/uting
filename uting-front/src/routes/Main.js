import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Profile from "../components/profile/Profile";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Meeting from "../components/meeting/Meeting";
import MeetingList from "../components/meeting/MeetingList";
import Groups from "../components/group/Groups";
import "./Main.css";
import socketio from 'socket.io-client';

const Main = () => {
  const history = useHistory();
  const [toggleMakeMeeting, setToggleMakeMeeting] = useState(false);
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);

  const [socketId,setSocketId]=useState("");
  const socket = socketio.connect('http://localhost:3001');
  let sessionUser = sessionStorage.getItem("email");

  const gotoAdminPage = () => {
    history.push({
      pathname: `/admin`,
    });
  };

  useEffect(() => {
    socket.on('connect',function(){
      console.log("connection server");
      socket.emit('login',{uid:sessionStorage.getItem('nickname')})
    })
    
    socket.on('clientid', function async(id) {
      setSocketId(id)
      console.log(id)
    })
    
    
  }, []);
  
  let putSocketid = async(e)=>{
    let data={
      "currentUser":sessionStorage.getItem('nickname'),
      "currentSocketId":socketId
    }
    const res = await axios.post("http://localhost:3001/users/savesocketid",data);
    console.log(res)
  }
  useEffect(()=>{
    putSocketid()
    
  },[socketId])

  return (
    <div className="mainContainer" style={{backgroundColor:"#ffe4e1", width:"100vw", height:"100vh"}}>
      
      {sessionUser === "admin@ajou.ac.kr" ? (
        <button onClick={gotoAdminPage}>관리자페이지</button>
      ) : (
        ""
      )}
      <div className="main">
        <button
          onClick={(e) => {
            toggleMakeMeetingBtn(e);
          }}
          style={{ float: "right" }}
        >
          방만들기
        </button>
      </div>
      <Modal isOpen={toggleMakeMeeting}>
        <ModalBody isOpen={toggleMakeMeeting}>
          <Meeting />
        </ModalBody>
        <ModalFooter isOpen={toggleMakeMeeting}>
          <Button color="secondary" onClick={toggleMakeMeetingBtn}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Profile />
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly"}}>
      <div style={{}}>학교 랭킹 넣는 자리 </div>
      <MeetingList />
      <Groups />
      </div>
      
    </div>
  );
};

export default Main;
