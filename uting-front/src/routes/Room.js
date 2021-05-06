import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'
import Vote from '../components/meeting/Vote'
import socketio from "socket.io-client";
import ReactAudioPlayer from 'react-audio-player';


const Room = () => {
  const location = useLocation();
  const history = useHistory();
  const socket = socketio.connect("http://localhost:3001");

  const [socketFlag, setSocketFlag] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [participantsSocketId,setParticipantsSocketId]=useState([]);
  const [participants,setParticipants] = useState([]);
  const [musicsrc,setMusicsrc]=useState("")

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

  useEffect(() => {
    putSocketid();
  }, [socketId]);

  let saveParticipantsSocketId = async()=>{
    let data={
      preMember:participants
    }
    const res = await axios.post("http://localhost:3001/users/preMemSocketid",data)
 
    
    if(res.data!=="undefined"){
      setParticipantsSocketId(res.data)
    }
  }

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
  }, []);

  socket.on("musicplay", function (data) {
    setMusicsrc(data.src)
  })

  socket.on('musicpause',function(data){
    //alert(data)
    document.getElementById("audio").pause();
  })

  socket.on('replay',function(data){
    //alert(data)
    document.getElementById("audio").play();
  })

 

  useEffect(()=>{
    setTimeout(()=>{
      getparticipants()
    },5000)
    
  },[socketFlag])
  

  useEffect(()=>{
    saveParticipantsSocketId()
  },[participants])

  

  return (
    <div style={{ backgroundColor: "#ffe4e1", width: "100vw", height: "100vh", padding: "2%" }}>
      <ReactAudioPlayer id="audio" src={musicsrc}  controls/>
    <McBot participantsSocketIdList={participantsSocketId} currentSocketId={socketId} participants={participants}></McBot>
    
    <Vote participantsSocketIdList={participantsSocketId} currentSocketId={socketId} participants={participants}></Vote>
    </div>
  );
};

export default Room;
