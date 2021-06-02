import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Form,
  FormGroup,
  Label,
  FormText,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import socketio from "socket.io-client";
import introLog from '../../img/배경없는유팅로고.png'
import { SOCKET } from "../../utils/constants";
const AddMember = ({ currentUser, modalState, checkMember, prevMember,currentsocketId,preMemSocketIdList }) => {
 
  const [newmember,setNewmember] = useState("")
  const [socketCnt,setSocketCnt]=useState(false);
  const [socketId,setSocketId]=useState("");
  const [precheck,setPrecheck]=useState(false);
  const [getalert,setGetalert]=useState({"flag":false,"message":""})
  
  let onChangehandler = (e) => {
    let { name, value } = e.target;
    setNewmember(value)   
   
  };
  const addGroupMember = async (e)=>{
    let data ={
      "addMember":newmember
    }
    const res = await axios.post('/api/users/logined', data);
 
    if(res.data.status===true){
      setSocketId(res.data.socketid)
      let groupData={
        "host":currentUser,
        "memberNickname":res.data.nickname
        
      }
      const resgroup = await axios.post('/api/groups/',groupData);
      
      setSocketCnt(true);
      modalState(true);
      if(prevMember===true){
        checkMember(false);
      }
      if(prevMember===false){
        checkMember(true);
      }
    }
    else{
      //alert("현재 접속 중인 사용자가 아니거나, 닉네임이 올바르지 않습니다.")
      setGetalert({"flag":true,"message":"현재 접속 중인 사용자가 아니거나,닉네임이 올바르지 않습니다."});
       setTimeout(()=>{
        setGetalert({"flag":false,"message":""})
       },2000)
     
    }
      //가입된 사용자가 맞는지, 현재 로그인한 사용자가 맞는지 

  }

  useEffect(()=>{
    setGetalert({"flag":false,"message":""});
  },[])

  useEffect(()=>{
    
    console.log(preMemSocketIdList)
    const socket = socketio.connect(SOCKET);
    socket.emit('message',{"socketid":socketId})
    
    setPrecheck(true);
  },[socketCnt])

  useEffect(()=>{

   
      let check=false;
      for(let i =0;i<preMemSocketIdList.length;i++){
        if(preMemSocketIdList[i]===currentsocketId.id){
          preMemSocketIdList.splice(i,1)
          check=true;
          i--;
        }
      }
      if(check===true){
        const socket = socketio.connect(SOCKET);
          socket.emit('premessage',{"socketidList":preMemSocketIdList})
      

      }
 
    
  },[precheck])
return (
  <div>
    <ModalBody>
            <div style={{textAlign:"center",marginBottom:"2%",fontFamily:"Jua",fontSize:"20px"}}>추가할 사용자의 닉네임을 기입하시오.</div>
              <Input style={{width:"80%",display:"inline"}} onChange={(e)=>onChangehandler(e)} type ="text"/>
              <Button style={{display:"inline",marginLeft:"5%",marginBottom:"2%"}}  color="danger" onClick={(e)=>addGroupMember(e)} >추가</Button>
    </ModalBody>
    <Modal isOpen={getalert.flag} >
        <ModalHeader style={{height:"70px",textAlign:"center"}}>
          <img style={{width:"40px",height:"40px",marginLeft:"210px",marginBottom:"1000px"}} src={introLog}></img>
        </ModalHeader>
        <ModalBody style={{height:"90px"}}>
          <div style={{textAlign:"center",marginTop:"4%",marginBottom:"8%",fontFamily:"NanumSquare_acR",fontWeight:"bold",fontSize:"15px",height:"50px"}}>{getalert.message}</div>
          
        </ModalBody>
      </Modal>
  </div>
);
};

export default AddMember;
