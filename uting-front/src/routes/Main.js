import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Profile from "../components/profile/Profile";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Meeting from "../components/meeting/Meeting";
import MeetingList from "../components/meeting/MeetingList";
import Groups from "../components/group/Groups";
import "./Main.css";
import socketio from "socket.io-client";
import utingLogo from "../img/utingLogo.png";


import { useAppState } from '../providers/AppStateProvider';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';
import { createGetAttendeeCallback, fetchMeeting } from '../utils/api';

const Main = () => {
  const history = useHistory();
  const meetingManager = useMeetingManager();
  const { setAppMeetingInfo, region: appRegion, meetingId: appMeetingId } = useAppState();

  const [toggleMakeMeeting, setToggleMakeMeeting] = useState(false);
  const [checkRoomList,setCheckRoomList]=useState(false);
  const [checkGroup,setCheckGroup]=useState(false)
  const [checkAnother,setCheckAnother]=useState(false);
  const [addEvent,setAddEvent]=useState(false);
  const [groupSocketList,setGroupSocketList]=useState([])
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);

  const [socketId, setSocketId] = useState("");
  const socket = socketio.connect("http://localhost:3001");
  let sessionUser = sessionStorage.getItem("email");

  const gotoAdminPage = () => {
    history.push({
      pathname: `/admin`,
    });
  };

  let checkList = (e) => {
    if (e === true) {
      setCheckRoomList(true);
      setToggleMakeMeeting(false);
    }
  };

  let groupSocket = (e) =>{
    setGroupSocketList(e)
  }

  let preMessage = (e)=>{
    if(e===true){
      setAddEvent(true)
    }
  };

  let goMeetingRoom = async(e)=>{
    
  }

  useEffect(() => {}, [addEvent]);

  socket.on("sendMember", function (data) {
    alert(data);
    setCheckGroup(true);
  });

  socket.on("makeMeetingRoomMsg", async function (data) {
    let temp = {
      title: data,
    }
    //data가 방제....
    alert(data);
      //여깅

    meetingManager.getAttendee = createGetAttendeeCallback(data);
  
    try {
      const { JoinInfo } = await fetchMeeting(temp);
  
      await meetingManager.join({
        meetingInfo: JoinInfo.Meeting,
        attendeeInfo: JoinInfo.Attendee
      });
  
      setAppMeetingInfo(data, "Tester", "ap-northeast-2");
      history.push("/deviceSetup");
    } catch (error) {
      console.log(error);
    }    
  });

  //다른 그룹원 추가
  socket.on("premessage", function (data) {
    setTimeout(() => {
      alert(data);
      setCheckAnother(true);
    }, 5000);
  })

  socket.on("entermessage",function(data){
    console.log("entermessage");
    alert(data.message)
    console.log(data._id)
    console.log(data.roomid)
    socket.emit("joinRoom", data.roomid);
    history.push({
      pathname: `/room/`+data.roomid,
      state:{_id:data._id}
    });
  })
  
  
  useEffect(() => {
    socket.on("connect", function () {
      socket.emit("login", { uid: sessionStorage.getItem("nickname") });
    });

    socket.on("clientid", function async(id) {
      setSocketId(id);
    });

  }, []);

  let putSocketid = async (e) => {
    let data = {
      currentUser: sessionStorage.getItem("nickname"),
      currentSocketId: socketId,
    };
    const res = await axios.post(
      "http://localhost:3001/users/savesocketid",
      data
    );
  };
  useEffect(() => {
    putSocketid();
  }, [socketId]);

  return (
    <div
      style={{
        backgroundColor: "#ffe4e1",
        width: "100vw",
        height: "100vh",
        padding: "2%",
      }}
    >
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
            <Meeting checkFunc={(e) => checkList(e)} />
          </ModalBody>
          <ModalFooter isOpen={toggleMakeMeeting}>
            <Button color="secondary" onClick={toggleMakeMeetingBtn}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <Profile />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <div style={{}}>학교 랭킹 넣는 자리 </div>
        <MeetingList currentsocketId={socketId} groupSocketList={groupSocketList} checkState={checkRoomList} />
        <Groups groupSocket={(e)=>groupSocket(e)} currentsocketId={socketId} checkGroup={checkGroup} checkAnother={checkAnother} />
      </div>
    </div>
  );
};

export default Main;
