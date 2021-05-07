import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import styled from 'styled-components';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Progress } from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'
import socketio from "socket.io-client";
import Vote from "../components/meeting/Vote"
const Room = () => {
  const location = useLocation();
  const history = useHistory();
  const socket = socketio.connect("http://localhost:3001");

  const [socketFlag, setSocketFlag] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantsSocketId,setParticipantsSocketId]=useState([]);
  const [vote, setVote] = useState(false);

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

  let saveParticipantsSocketId = async()=>{
    let data={
      preMember:participants
    }
    const res = await axios.post("http://localhost:3001/users/preMemSocketid",data)
 
    
    if(res.data!=="undefined"){
      console.log(res.data);
      setParticipantsSocketId(res.data)
    }
    
  }

  socket.on("startVote", function (data) {
    console.log("startVote");
    alert("미팅 종료를 위한 투표를 시작합니다.");
   
  })
  const getparticipants = async () => {
    const _id = location.state._id;
    const res = await axios.post("http://localhost:3001/meetings/getparticipants", { _id: _id })
    
    setParticipants(res.data);
  }

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
    saveParticipantsSocketId()
  },[participants])


  useEffect(()=>{
    setTimeout(()=>{
      getparticipants();
    },5000)
    
  },[socketFlag])
  

  useEffect(() => {
    putSocketid();
  }, [socketId]);

  

  return (
    <div style={{ backgroundColor: "#ffe4e1", width: "100vw", height: "100vh", padding: "2%" }}>
    <McBot participantsSocketIdList={participantsSocketId} currentSocketId={socketId} participants={participants}></McBot>
    
    <Vote participantsSocketIdList={participantsSocketId} participants={participants}></Vote>
    </div>
  );
};

export default Room;
