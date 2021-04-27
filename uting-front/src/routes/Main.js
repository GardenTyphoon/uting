import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import axios from "axios";
import MyProfile from "../components/profile/MyProfile";
import ProfileNoImage from "../img/ProfileNoImage.jpg";
import {
  Button,
  CardBody,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from "reactstrap";
import Meeting from "../components/meeting/Meeting";
import MeetingList from "../components/meeting/MeetingList";
import Groups from "../components/group/Groups";
import "./Main.css";
import socketio from 'socket.io-client';

const Main = () => {
  const history = useHistory();
  const [imgBase64, setImgBase64] = useState("");
  const [ProfileInfo, setProfileInfo] = useState({
    nickname: "",
    imgURL: "",
    mannerCredit: "",
    ucoin: "",
  });
  const [toggleprofile, setToggleProfile] = useState(false);
  const [toggleMakeMeeting, setToggleMakeMeeting] = useState(false);
  const toggleProfileBtn = (e) => setToggleProfile(!toggleprofile);
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);

  let sessionUser = sessionStorage.getItem("email");
  let userNickname = sessionStorage.getItem("nickname");

  const [socketCheck,setSocketCheck]=useState(false);
  const [socketId,setSocketId]=useState("");
  const socket = socketio.connect('http://localhost:3001');

  const gotoAdminPage = () => {
    history.push({
      pathname: `/admin`,
    });
  };
  const coinWindow = () => {
    const coinWin = window.open(
      //ret = 창 객체
      "http://localhost:3000/ucoin",
      "_blank",
      "resizable=no, left=0, top=0, width=622, height=520"
    );
  };

  useEffect(() => {
    getProfile();

    socket.on('connect',function(){
      console.log("connection server");
      socket.emit('login',{uid:sessionStorage.getItem('nickname')})
      setSocketCheck(true)


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


  const getProfile = async (e) => {
    const res = await axios.post("http://localhost:3001/users/viewMyProfile", {
      sessionUser: sessionUser,
    });
    if (res.data.imgURL !== "") {
      let staticpath = "http://localhost:3001";
      setImgBase64(staticpath + res.data.imgURL);
    }
    let data = {
      nickname: res.data.nickname,
      imgURL: res.data.imgURL,
      ucoin: res.data.ucoin,
    };
    setProfileInfo(data);
  };
  return (
    <div className="mainContainer">
      <div className="Logo">
        <h5>메인</h5>
      </div>
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
      <div className="profile">
        <button
          onClick={(e) => {
            toggleProfileBtn(e);
          }}
          style={{ float: "left" }}
        >
          {imgBase64 === "" ? (
            <img
              src={ProfileNoImage}
              alt="profile img"
              height="70"
              width="70"
            />
          ) : (
            <img src={imgBase64} alt="profile img" height="70" width="70" />
          )}
        </button>
        <span>
          <strong>{ProfileInfo.nickname}</strong>
          <br />
          <strong> {ProfileInfo.ucoin}Ucoin</strong>
          <button onClick={coinWindow} style={{ float: "right" }}>
            Ucoin충전
          </button>
        </span>
      </div>
      <Modal isOpen={toggleprofile}>
        <ModalBody isOpen={toggleprofile} className="profileModal">
          <Row>
            <button
              onClick={(e) => {
                toggleProfileBtn(e);
              }}
              style={{
                background: "transparent",
                border: "none",
                position: "absolute",
                left: "90%",
              }}
            >
              X
            </button>
          </Row>
          <Row>
            <MyProfile />
          </Row>
        </ModalBody>
      </Modal>
      <MeetingList />
      <Groups />
    </div>
  );
};

export default Main;
