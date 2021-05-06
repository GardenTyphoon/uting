import React,{useEffect, useState} from "react";
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'
import socketio from "socket.io-client";

const Room = () => {
  const socket = socketio.connect("http://localhost:3001");
  const [socketId, setSocketId] = useState("");
  const [groupSocketIdList,setGroupSocketIdList]=useState([]);
  const [groupMember,setGroupMember] = useState([]);
  const [socketFlag,setSocketFlag]=useState(false);

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


  const getGroupInfo = async (e) => {
    let sessionUser = sessionStorage.getItem("nickname");
    let sessionObject = { sessionUser: sessionUser };
    const res = await axios.post(
      "http://localhost:3001/groups/info",
      sessionObject
    );
    setGroupMember(res.data.member);
  };

  let saveGroupSocketId = async()=>{
    let data={
      preMember:groupMember
    }
    const res = await axios.post("http://localhost:3001/users/preMemSocketid",data)
 
    
    if(res.data!=="undefined"){
      setGroupSocketIdList(res.data)
    }

    console.log(res.data)
    console.log(socketId)
    console.log(groupMember)
    
  }

  useEffect(()=>{
    setTimeout(()=>{
      getGroupInfo()
    },5000)
    
  },[socketFlag])

  useEffect(()=>{
    saveGroupSocketId()
  },[groupMember])


  return (
    <div style={{ backgroundColor: "#ffe4e1", width: "100vw", height: "100vh", padding: "2%" }}>
      <McBot groupSocketIdList={groupSocketIdList} currentSocketId={socketId} groupMember={groupMember}></McBot>
      
    </div>
  );
};

export default Room;
