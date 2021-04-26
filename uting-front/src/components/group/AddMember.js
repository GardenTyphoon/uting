import React,{useEffect, useState} from "react";
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Form, FormGroup, Label, FormText ,Badge,Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import axios from 'axios';


const AddMember = ({currentUser,modalState,checkMember,prevMember}) => {

    const [newmember,setNewmember] = useState("")
    const [prevMem,setPrevMem]=useState(prevMember)
  


    let onChangehandler = (e) => {
      let { name, value } = e.target;
      setNewmember(value)    
    };
    const addGroupMember = async (e)=>{
      let data ={
        "addMember":newmember
      }
      const res = await axios.post('http://localhost:3001/users/logined', data);
     
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
        
      }
      else{
        alert("현재 접속 중인 사용자가 아니거나, 닉네임이 옳바르지 않습니다.")
        modalState(true);
      }
        //가입된 사용자가 맞는지, 현재 로그인한 사용자가 맞는지 

    }
  return (
    <div>

      
      <ModalBody>
              <div>추가할 사용자의 닉네임을 기입하시오.</div>
              <Input onChange={(e)=>onChangehandler(e)} type ="text"/>
              <Button color="danger" onClick={(e)=>addGroupMember(e)} >추가</Button>
      </ModalBody>

    </div>
  );
};

export default AddMember;