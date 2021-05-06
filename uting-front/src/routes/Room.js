import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import styled from 'styled-components';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Progress } from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'
import socketio from "socket.io-client";

const Room = () => {
  const location = useLocation();
  const history = useHistory();
  const socket = socketio.connect("http://localhost:3001");

  const [toggleEndMeetingBtn, setToggleEndMeetingBtn] = useState(false);
  const [startVote, setStartVote] = useState(false);
  const [numOfAgree, setNumOfAgree] = useState(0);
  const [numOfDisagree, setNumOfDisagree] = useState(0);
  const [socketFlag, setSocketFlag] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [socketList, setSocketList] = useState();
  const [groupSocketIdList,setGroupSocketIdList]=useState([]);
  const [groupMember,setGroupMember] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isVote, setIsVote] = useState(false);
  const [flag, setFlag] = useState(false);
  const [myDeicision, setMyDecision] = useState();
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
  let saveGroupSocketId = async()=>{
    let data={
      preMember:groupMember
    }
    const res = await axios.post("http://localhost:3001/users/preMemSocketid",data)
 
    
    if(res.data!=="undefined"){
      setGroupSocketIdList(res.data)
    }
    
  }
  function conditionEndMeeting(){
    if (numOfAgree > participants.length / 2) return true;
    else return false;
  }
  function doneVote(){
    if (startVote===true &&  numOfAgree + numOfDisagree === participants.length) return true;
    else return false;
  }
  function resetVote (){
    setStartVote(false);
    setNumOfAgree(0);
    setNumOfDisagree(0);
    setIsVote(false);
    setMyDecision("");
  }
  const onClickEndMeetingBtn = (e) => {
    setToggleEndMeetingBtn(!toggleEndMeetingBtn)
  }
  const onClickStartVoteBtn = async (e) => {
    setToggleEndMeetingBtn(!toggleEndMeetingBtn)
    setStartVote(true);
    setFlag(true);
  }
  const onClickAgree = (e) => {
    
    socket.emit("endMeetingAgree", { socketList, numOfAgree: numOfAgree + 1 });
    setNumOfAgree(numOfAgree + 1);
    setIsVote(!isVote);
    setMyDecision("찬성");
  }
  const onClickDisagree = (e) => {
    socket.emit("endMeetingDisagree", { socketList, numOfDisagree: numOfDisagree + 1 });
    setNumOfDisagree(numOfDisagree + 1);
    setIsVote(!isVote);
    setMyDecision("반대");
  }
  const emitStartVote = async () => {

    let res = await axios.post("http://localhost:3001/users/usersSocketId", { users: participants });
    
    socket.emit("startVote", { socketidList: res.data });
    setSocketList(res.data);

  }

  const getparticipants = async () => {
    const _id = location.state._id;
    const res = await axios.post("http://localhost:3001/meetings/getparticipants", { _id: _id })

    setParticipants(res.data);
  }
  const getGroupInfo = async (e) => {
    let sessionUser = sessionStorage.getItem("nickname");
    let sessionObject = { sessionUser: sessionUser };
    const res = await axios.post(
      "http://localhost:3001/groups/info",
      sessionObject
    );
    setGroupMember(res.data.member);
  };



  socket.on("startVote", function (data) {

    alert("미팅 종료를 위한 투표를 시작합니다.");
  
    setStartVote(true);
    setSocketList(data);
  })
  socket.on("endMeetingAgree", function (data) {
    setNumOfAgree(data);
  })
  socket.on("endMeetingDisagree", function (data) {
    setNumOfDisagree(data);
  })


  useEffect(()=>{
    setTimeout(()=>{
      getGroupInfo()
    },5000)
    
  },[socketFlag])
  useEffect(() => {
  }, [socketList]);
  useEffect(() => {
    putSocketid();
  }, [socketId]);

  useEffect(() => {
    if (startVote === true) {
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
  useEffect(()=>{
    saveGroupSocketId()
  },[groupMember])
  useEffect(() => {
    if (doneVote()) {
      if (conditionEndMeeting()) {
        alert("투표가 종료되었습니다. 미팅을 종료합니다.")
        history.push({
          pathname: `/main`
        });
      }
      else {
        alert("투표가 종료되었습니다. 미팅을 계속합니다.")
        resetVote();
      }
    }
  }, [numOfAgree, numOfDisagree])

  return (
    <div style={{ backgroundColor: "#ffe4e1", width: "100vw", height: "100vh", padding: "2%" }}>

    <McBot groupSocketIdList={groupSocketIdList} currentSocketId={socketId} groupMember={groupMember}></McBot>
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
          {isVote === false ?
            <div>
              <button onClick={(e) => onClickAgree(e)}>찬성</button>
              <button onClick={(e) => onClickDisagree(e)}>반대</button>
            </div>
            : <div>{myDeicision}하셨습니다.</div>}

          <Progress multi>
            <Progress bar color="success" value={numOfAgree} max={participants.length} />
            <Progress bar color="danger" value={numOfDisagree} max={participants.length} />
          </Progress>
        </div>
        : ""}
    </div>
  );
};

export default Room;
