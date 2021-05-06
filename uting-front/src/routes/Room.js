import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styled from 'styled-components';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Progress } from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'
import socketio from "socket.io-client";

const Room = () => {
  const location = useLocation();
  const [toggleEndMeetingBtn, setToggleEndMeetingBtn] = useState(false);
  const [startVote, setStartVote] = useState(false);
  const [numOfAgree, setNumOfAgree] = useState(0);
  const [numOfDisagree, setNumOfDisagree] = useState(0);
  const socket = socketio.connect("http://localhost:3001");
  const [socketFlag,setSocketFlag]=useState(false);
  const [socketId, setSocketId] = useState("");
  const [socketList, setSocketList] = useState();
  const [participants, setParticipants] = useState();
  const [flag, setFlag] = useState(false);

  let putSocketid = async (e) => {
    let data = {
      currentUser: sessionStorage.getItem("nickname"),
      currentSocketId: socketId,
    };
    const res = await axios.post(
      "http://localhost:3001/users/savesocketid",
      data
    );
    setSocketFlag(!socketFlag)
  };

  const onClickEndMeetingBtn = (e) => {
    setToggleEndMeetingBtn(!toggleEndMeetingBtn)
  }
  const onClickStartVoteBtn = async (e) => {
    setToggleEndMeetingBtn(!toggleEndMeetingBtn)
    setStartVote(true);
    setFlag(true);
  }
  const onClickAgree = (e) =>{

    socket.emit("endMeetingAgree",  {socketList, numOfAgree : numOfAgree+1});
    setNumOfAgree(numOfAgree+1);
  }
  const onClickDisagree = (e) =>{
    console.log("disagree");
    socket.emit("endMeetingDisagree",  { socketList, numOfDisagree : numOfDisagree+1});
    setNumOfDisagree(numOfDisagree+1);
  }
  const emitStartVote = async() =>{

    let res = await axios.post("http://localhost:3001/users/usersSocketId", {users:participants});
    console.log(res);
    socket.emit("startVote",{socketidList : res.data});
    setSocketList(res.data);
  }

  const getparticipants = async() => {
    const _id = location.state._id;
    const res =  await axios.post("http://localhost:3001/meetings/getparticipants", {_id:_id})

    setParticipants(res.data);
  }

  

  socket.on("startVote", function (msg) {
   console.log("startVote");
   setStartVote(true);
  })
  socket.on("endMeetingAgree", function(data){
    setNumOfAgree(data);
  })
  socket.on("endMeetingDisagree", function(data){
    setNumOfDisagree(data);
  })
  useEffect(() => {
    putSocketid();
  }, [socketId]);

  useEffect(()=>{
    if(startVote===true){
      emitStartVote();
    }
  }, [flag])

  useEffect(() => {
    socket.on("connect", function () {
      socket.emit("login", { uid: sessionStorage.getItem("nickname") });
    });

    socket.on("clientid", function async(id) {
      setSocketId(id);
    });

    getparticipants();
  }, [])

  return (
    <div style={{ backgroundColor: "#ffe4e1", width: "100vw", height: "100vh", padding: "2%" }}>

      <McBot></McBot>
      <button onClick={(e) => onClickEndMeetingBtn(e)}>미팅 종료</button>
      <Modal isOpen={toggleEndMeetingBtn}>
        <ModalBody>
          미팅 종료 버튼을 누르셨습니다.
          미팅 종료를 위한 투표를 진행하시겠습니까?
         </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => onClickStartVoteBtn(e)}>투표하기</Button>{' '}
          <Button color="secondary" onClick={(e) => onClickEndMeetingBtn(e)}>취소</Button>
        </ModalFooter>
      </Modal>
      {startVote === true ?
        <div style={{ backgroundColor: "#fffff0", borderRadius: "20px" }}>
          <div>미팅을 종료하시겠습니까?</div>
          <button onClick={(e)=>onClickAgree(e)}>찬성</button>
          <button onClick={(e)=>onClickDisagree(e)}>반대</button>
          <Progress multi>
            <Progress bar color="success" value={numOfAgree} max={participants.length}/>
            <Progress bar color="danger" value={numOfDisagree} max={participants.length}/>
          </Progress>

        </div>
        : ""}
    </div>
  );
};

export default Room;
