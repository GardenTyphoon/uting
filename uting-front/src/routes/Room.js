import React,{useEffect, useState} from "react";
import styled from 'styled-components';
import { useLocation, useHistory } from "react-router";
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'
import socketio from "socket.io-client";
import ReactAudioPlayer from 'react-audio-player';

const Room = () => {
  const location = useLocation();
  const history = useHistory();
  const socket = socketio.connect("http://localhost:3001");
  const [socketId, setSocketId] = useState("");
  const [participantsSocketId,setParticipantsSocketId]=useState([]);
  const [participants,setParticipants] = useState([]);
  const [socketFlag,setSocketFlag]=useState(false);
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

  useEffect(() => {
    socket.on("connect", function () {
      socket.emit("login", { uid: sessionStorage.getItem("nickname") });
    });

    socket.on("clientid", function async(id) {
      setSocketId(id);
    });
  }, []);

/*
  const getparticipants  = async (e) => {
    let sessionUser = sessionStorage.getItem("nickname");
    let sessionObject = { sessionUser: sessionUser };
    const res = await axios.post(
      "http://localhost:3001/groups/info",
      sessionObject
    );
    setParticipants(res.data.member);
  };*/

  const getparticipants = async () => {
    const _id = location.state._id;
    const res = await axios.post("http://localhost:3001/meetings/getparticipants", { _id: _id })
    
    setParticipants(res.data);
  }

  let saveParticipantsSocketId = async()=>{
    let data={
      preMember:participants
    }
    const res = await axios.post("http://localhost:3001/users/preMemSocketid",data)
 
    
    if(res.data!=="undefined"){
      setParticipantsSocketId(res.data)
    }
    
  }
  socket.on("musicplay", function (data) {
    setMusicsrc(data.src)
    
  })

  socket.on('musicpause',function(data){
    alert(data)
    document.getElementById("audio").pause();
  })

  socket.on('replay',function(data){
    alert(data)
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
      <McBot participantsSocketId={participantsSocketId} currentSocketId={socketId} participants={participants}></McBot>
      
    </div>
  );
};

export default Room;
