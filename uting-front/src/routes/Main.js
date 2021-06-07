import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Profile from "../components/profile/Profile";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Meeting from "../components/meeting/Meeting";
import MeetingList from "../components/meeting/MeetingList";
import Groups from "../components/group/Groups";
import "./Main.css";
import socketio from "socket.io-client";
import utingLogo from "../img/utingLogo.png";
import helpLogo from '../img/help.png';
import Filter from "../components/main/Filter.js";
import introLog from '../img/배경없는유팅로고.png'
import CollegeRanking from "../components/main/CollegeRanking.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import renewImg from "../img/새로고침.svg";
import Tutorial from "../components/main/Tutorial.js";

import { useAppState } from "../providers/AppStateProvider";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { createGetAttendeeCallback, fetchMeeting } from "../utils/api";
import { minWidth } from "styled-system";

const Main = () => {
  const history = useHistory();
  const meetingManager = useMeetingManager();
  const {
    setAppMeetingInfo,
    region: appRegion,
    meetingId: appMeetingId,
  } = useAppState();

  const [toggleMakeMeeting, setToggleMakeMeeting] = useState(false);
  const [checkRoomList, setCheckRoomList] = useState(false);
  const [checkGroup, setCheckGroup] = useState(false);
  const [checkAnother, setCheckAnother] = useState(false);
  const [addEvent, setAddEvent] = useState(false);
  const [groupSocketList, setGroupSocketList] = useState([]);
  const [roomtitle, setRoomtitle] = useState("");
  const [filterRoomName, setFilterRoomName] = useState("");
  const [filtermanner, setFiltermanner] = useState({});
  const [filterage, setFilterage] = useState({});
  const [getorigin, setGetorigin] = useState(false);
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);
  const toggleGetorigin = (e) => setGetorigin(!getorigin);
  const [socketId, setSocketId] = useState("");
  const [tutorialmodal, setTutorialModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [getalert,setGetalert]=useState({"flag":false,"message":""})
  
  let toggleAlert =(e)=>{
    setGetalert({...getalert,"flag":!getalert.flag})
  }

  const tutorialtoggle = (e) => setTutorialModal(!tutorialmodal);
  let sessionEmail = sessionStorage.getItem("email");
  let sessionUser = sessionStorage.getItem("nickname");


  const gotoAdminPage = () => {
    history.push({
      pathname: `/admin`,
    });
  };

  const checkList = (e) => {
    if (e === true) {
      setCheckRoomList(true);
      setToggleMakeMeeting(false);
    }
  };

  const groupSocket = (e) => {
    setGroupSocketList(e);
  };
  useEffect(() => {}, [addEvent]);

  useEffect(() => {
   // setTutorialModal(true);

    const socket = socketio.connect("http://localhost:3001");
    socket.on("connect", function () {
      socket.emit("login", { uid: sessionStorage.getItem("nickname") });
    });

    socket.on("clientid", function async(id) {
      setSocketId(id);
    });

    socket.on("main", function (data) {
      if (data.type === "premessage") {
        setTimeout(() => {
          toast(data.message);
          setCheckAnother(true);
        }, 5000);
      } else if (data.type === "entermessage") {
        toast(data.message);
        socket.emit("joinRoom", data.roomid);
        history.push({
          pathname: `/room/` + data.roomid,
          state: { _id: data._id },
        });
      } else if (data.type === "sendMember") {
        toast(data.message);
        setCheckGroup(true);
      } else if (data.type === "makeMeetingRoomMsg") {
        let temp = {
          title: data,
        };
        toast("'" + data.roomtitle + "'방에 초대되었습니다. >_<");
        setRoomtitle(data.roomtitle);
      } else if (data.type === "someoneLeaveGroup") {
        toast(data.message);
        window.location.reload();
      }
    });

    return () => {
      socket.removeListener("main");
      socket.removeListener("clientid");
      socket.removeListener("connect");
    };
  }, []);

  useEffect(() => {
    if (roomtitle !== "") {
      goRoom();
    }
  }, [roomtitle]);

  const goRoom = async () => {
    let temp = {
      title: roomtitle,
      session: sessionUser,
      flag: 2,
    };

    meetingManager.getAttendee = createGetAttendeeCallback(roomtitle);

    try {
      const { JoinInfo } = await fetchMeeting(temp);

      await meetingManager.join({
        meetingInfo: JoinInfo.Meeting,
        attendeeInfo: JoinInfo.Attendee,
      });
      setAppMeetingInfo(roomtitle, sessionUser, "ap-northeast-2");

      await meetingManager.start();

      history.push(`/room/${roomtitle}`);
    } catch (error) {
      console.log(error);
    }
  };

  const putSocketid = async (e) => {
    console.log(socketId);
    let data = {
      currentUser: sessionStorage.getItem("nickname"),
      currentSocketId: socketId,
    };
    const res = await axios.post(
      "http://localhost:3001/users/savesocketid",
      data
    );
    console.log(res);
  };
  useEffect(() => {
    putSocketid();
  }, [socketId]);

  const filterRoomTitle = (e) => {
    setFilterRoomName(e);
  };

  const filterManner = (e) => {
    let data = {
      first: e.first,
      last: e.last,
    };
    console.log(data);
    setFiltermanner(data);
  };

  const filterAge = (e) => {
    let data = {
      first: e.first,
      last: e.last,
    };
    setFilterage(data);
  };

  return (
    <div className="mainContainer">
      <div className="mainTop">
          <img className="utingLogo"  onClick={()=>history.push("/")}  src={utingLogo} />
        
        <button style={{border:"0",backgroundColor:"rgb(255,228,225)",marginRight:"1%",position:"absolute",right:"0px",marginBottom:"5%"}} onClick={(e)=>tutorialtoggle(e)} ><span style={{color:"rgb(89,57,70)",fontFamily: "NanumSquare_acR",fontWeight:"bold"}}>유팅메뉴얼</span><img style={{width:"20px",height:"20px",marginLeft:"7px",marginBottom:"10px"}} src={helpLogo}></img></button>
      </div>
      <div className="mainBottom">
        <div className="CollegeRanking">
          <div style={{ fontFamily: "NanumSquare_acR",  fontSize: "large", color:"rgb(89,57,70)", fontWeight: "bold", marginBottom:"6%", marginTop:"3%" }}>
            학교별 매너학점 TOP10
          </div>
          <CollegeRanking />
        </div>

        <div className="Room">
          <div className="RoomTop" style={{ width: "100%", marginBottom:"20px" }}>
            <div className="RoomTop" style={{ width: "75%" }}>
              <div
                style={{
                  fontFamily: "NanumSquare_acR",
                  fontSize: "large",
                  color:"rgb(89,57,70)",
                  marginRight: "25px",
                  fontWeight:"bold"
                }}
              >
                Room List
              </div>
              <Filter
                filterRoomTitle={(e) => filterRoomTitle(e)}
                filterManner={(e) => filterManner(e)}
                filterAge={(e) => filterAge(e)}
              />
            </div>
            <button className="renewbtn"  style={{ width: "5%", marginRight: "3%" }}  onClick={(e) => toggleGetorigin(e)}>
              <img
              src={renewImg}
            /></button>
            

            <button
              className="makeRoomBtn"
              onClick={(e) => {
                toggleMakeMeetingBtn(e);
              }}
            >
              방 생성
            </button>

            <Modal isOpen={toggleMakeMeeting}>
              <ModalHeader
                className="font"
                toggle={() => setToggleMakeMeeting(!toggleMakeMeeting)}
              >
                미팅방 정보 입력
              </ModalHeader>
              <ModalBody isOpen={toggleMakeMeeting}>
                <Meeting checkFunc={(e) => checkList(e)} />
              </ModalBody>
            </Modal>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: "10px",
              minHeight: "450px",
              height:"70vh",
            }}
          >
            <MeetingList
              getorigin={getorigin}
              filterRoomName={filterRoomName}
              filtermanner={filtermanner}
              filterage={filterage}
              currentsocketId={socketId}
              groupSocketList={groupSocketList}
              checkState={checkRoomList}
            />
          </div>
        </div>
        
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        
        <Profile />
        <Groups
          groupSocket={(e) => groupSocket(e)}
          currentsocketId={socketId}
          checkGroup={checkGroup}
          checkAnother={checkAnother}
        />
        </div>
       
        <Modal isOpen={getalert.flag} >
        <ModalHeader style={{height:"70px",textAlign:"center"}}>
          <img style={{width:"40px",height:"40px",marginLeft:"210px",marginBottom:"1000px"}} src={introLog}></img>
        </ModalHeader>
        <ModalBody style={{height:"90px"}}>
          <div style={{textAlign:"center",marginTop:"4%",marginBottom:"8%",fontFamily:"NanumSquare_acR",fontWeight:"bold",fontSize:"20px",height:"50px"}}>{getalert.message}</div>
          
        </ModalBody>
      </Modal>
      <Modal size="lg" isOpen={tutorialmodal} toggle={tutorialtoggle}>
          <ModalHeader style={{ marginLeft: "40%" }} toggle={tutorialtoggle}>
            U-TING 메뉴얼
          </ModalHeader>
          <ModalBody>
            <Tutorial></Tutorial>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default Main;
