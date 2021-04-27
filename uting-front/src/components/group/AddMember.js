import React,{useEffect, useState} from "react";
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Form, FormGroup, Label, FormText ,Badge,Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import axios from 'axios';
import socketio from 'socket.io-client';




const AddMember = ({currentUser,modalState,checkMember,prevMember}) => {

    const [newmember,setNewmember] = useState("")
    const [prevMem,setPrevMem]=useState(prevMember)
    const [socketCnt,setSocketCnt]=useState(false);
    //const socket = socketio.connect('http://localhost:3001');

    useEffect(()=>{
      // console.log("socket 전")
      // socket.on('connect',function(){
      //   console.log("connection server");
      //   socket.emit('login',{uid:currentUser})
      //   //socket.emit('login',{uid:newmember})
        
      // })
      
    },[])
    
    let sendMessage = ()=>{
      console.log("sendMessage 함수!")
      // socket.on('message', function (msg) {
      //   console.log("message 소켓 프론트")
      //   socket.emit('message', { newuid:newmember, msg:'그룹이 생성 될 예정입니다.' });
      //   document.write(msg);
      // });
      
    }
  
   
    let onChangehandler = (e) => {
      let { name, value } = e.target;
      setNewmember(value)   
      // socket.on('connect',function(){
      //   console.log("connection server");
      //   socket.emit('login',{newuid:newmember})
      //   //socket.emit('login',{uid:newmember})
      // })

      //socket.emit('login',{newuid:newmember})
      
    };
    const addGroupMember = async (e)=>{
      let data ={
        "addMember":newmember
      }
      const res = await axios.post('http://localhost:3001/users/logined', data);
      console.log(res.data)
      if(res.data.status===true){
        let groupData={
          "host":currentUser,
          "memberNickname":res.data.nickname
          
        }
        console.log(groupData)
        const resgroup = await axios.post('http://localhost:3001/groups/',groupData);
        console.log(resgroup)
        modalState(true);
        if(prevMem===true){
          checkMember(false);
        }
        if(prevMem===false){
          checkMember(true);
        }
        sendMessage();
        
      }
      else{
        alert("현재 접속 중인 사용자가 아니거나, 닉네임이 올바르지 않습니다.")
        modalState(true);
      }
        //가입된 사용자가 맞는지, 현재 로그인한 사용자가 맞는지 

    }
  return (
    <div>

      
      <ModalBody>
              <div style={{textAlign:"center",marginBottom:"2%",fontFamily:"Jua",fontSize:"20px"}}>추가할 사용자의 닉네임을 기입하시오.</div>
                <Input style={{width:"80%",display:"inline"}} onChange={(e)=>onChangehandler(e)} type ="text"/>
                <Button style={{display:"inline",marginLeft:"5%",marginBottom:"2%"}}  color="danger" onClick={(e)=>addGroupMember(e)} >추가</Button>
                
              
      </ModalBody>

    </div>
  );
};

export default AddMember;
