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
import utingLogo from '../img/utingLogo.png'
import { Container, Row, Col } from "reactstrap";
const Main = () => {
  const history = useHistory();
  const [toggleMakeMeeting, setToggleMakeMeeting] = useState(false);
  const [checkRoomList,setCheckRoomList]=useState(false);
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);


  const [socketId, setSocketId] = useState("");
  const socket = socketio.connect('http://localhost:3001');
  let sessionUser = sessionStorage.getItem("email");

  const gotoAdminPage = () => {
    history.push({
      pathname: `/admin`,
    });
  };

  let checkList = (e) =>{
    if(e===true){
      setCheckRoomList(true)
      setToggleMakeMeeting(false)
    }
    
  }

  socket.on("sendMember",function(data){
    console.log("sendMember")
    alert(data);
    window.location.href = "http://localhost:3000/main";
  })

  useEffect(() => {
    socket.on('connect', function () {
      console.log("connection server");
      socket.emit('login', { uid: sessionStorage.getItem('nickname') })
    })

    socket.on('clientid', function async(id) {
      setSocketId(id)
      console.log(id)
    })

    console.log(socketId)
  }, []);

  let putSocketid = async (e) => {
    let data = {
      "currentUser": sessionStorage.getItem('nickname'),
      "currentSocketId": socketId
    }
    const res = await axios.post("http://localhost:3001/users/savesocketid", data);
    console.log(res)
  }
  useEffect(() => {
    putSocketid()

  }, [socketId])

  return (
    <div style={{ backgroundColor: "#ffe4e1", width: "100vw", height: "100vh", padding: "2%" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <img style={{ width: "7%" }} src={utingLogo} />
        {sessionUser === "admin@ajou.ac.kr" ? (
          <button onClick={gotoAdminPage}>관리자페이지</button>
        ) : (
          ""
        )}
        <button

          className="makeRoomBtn"
          onClick={(e) => {
            toggleMakeMeetingBtn(e);
          }}
        >
          방 생성
        </button>
       
        <Modal isOpen={toggleMakeMeeting}>
          <ModalBody isOpen={toggleMakeMeeting}>
            <Meeting checkFunc={(e)=>checkList(e)}/>
          </ModalBody>
          <ModalFooter isOpen={toggleMakeMeeting}>
            <Button color="secondary" onClick={toggleMakeMeetingBtn}>
              Close
          </Button>
          </ModalFooter>
        </Modal>
        <Profile />
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
        <div style={{}}>학교 랭킹 넣는 자리 </div>
        <MeetingList checkState={checkRoomList} />
        <Groups currentsocketId={socketId}/>
      </div>

    </div>
  );
};

export default Main;
