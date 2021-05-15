import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Profile from "../components/profile/Profile";
import { Button, Modal, ModalBody, ModalFooter,ModalHeader } from "reactstrap";
import Meeting from "../components/meeting/Meeting";
import MeetingList from "../components/meeting/MeetingList";
import Groups from "../components/group/Groups";
import "./Main.css";
import socketio from "socket.io-client";
import utingLogo from "../img/utingLogo.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const [roomtitle,setRoomtitle]=useState("")
  
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);
  
  const [socketId, setSocketId] = useState("");
  
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
  useEffect(() => {}, [addEvent]);

  
  useEffect(() => {
    const socket = socketio.connect("http://localhost:3001");
    socket.on("connect", function () {
      socket.emit("login", { uid: sessionStorage.getItem("nickname") });
    });

    socket.on("clientid", function async(id) {
      setSocketId(id);
    });

    socket.on("main",function(data){
      if(data.type==="premessage"){
        setTimeout(() => {
          toast(data.message)
          setCheckAnother(true);
        }, 5000);
      }

      else if(data.type==="entermessage"){
        toast(data.message);
        socket.emit("joinRoom", data.roomid);
        history.push({
          pathname: `/room/`+data.roomid,
          state:{_id:data._id}
        });
      }

      else if(data.type==="sendMember"){
        toast(data.message);
        setCheckGroup(true);
      }
      else if(data.type==="makeMeetingRoomMsg"){
        console.log("여기깅")
        let temp = {
          title: data,
        }
        //data가 방제....
        toast("'"+data.roomtitle+"'방에 초대되었습니다. >_<");
        setRoomtitle(data.roomtitle)
          
      }
    })

  return ()=>{
    socket.removeListener('main')

  }
  

  }, []);

  useEffect(()=>{

    if(roomtitle!==""){
      goRoom()
    }
    
  },[roomtitle])

  let goRoom = async()=>{
    let temp = {
      title: roomtitle,
    }

    console.log("roomtitle",roomtitle)
    meetingManager.getAttendee = createGetAttendeeCallback(roomtitle);
      
    try {
        const {JoinInfo} = await fetchMeeting(temp);

        await meetingManager.join({
          meetingInfo: JoinInfo.Meeting,
          attendeeInfo: JoinInfo.Attendee
        });
        setAppMeetingInfo(roomtitle, "Tester", "ap-northeast-2");
        console.log(JoinInfo)
        history.push("/deviceSetup");
      
    } catch (error) {
      console.log(error);
    }  
  }

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
         <ModalHeader className="font" toggle={()=>setToggleMakeMeeting(!toggleMakeMeeting)}>미팅방 정보 입력</ModalHeader>
          <ModalBody isOpen={toggleMakeMeeting}>
            <Meeting checkFunc={(e) => checkList(e)} />
          </ModalBody>

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
      <ToastContainer />
    </div>
  );
};

export default Main;
