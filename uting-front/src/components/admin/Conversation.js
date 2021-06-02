import React, { useState,useEffect } from 'react';
import { Route, Link,Switch,Router } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import classnames from 'classnames';
import {Button,
    ButtonGroup,
    Card,
    CardBody,
    CardDeck,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Collapse,
    Container,
    Input,
    InputGroup,
    InputGroupAddon,
    Jumbotron,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink
  } from 'reactstrap';


const Conversation = ({tab}) => {
  const [addModal, setAddModal] = useState(false);
  const [newConversation,setNewConversation]=useState("")
  const [conversationList,setConversationList]=useState([]);
  const [check,setCheck]=useState(false);

  const toggle = () => setAddModal(!addModal);

  let onChangehandler = (e) => {
    let { name, value } = e.target;
    setNewConversation(value)
  };

  let submitConversation = async(e) =>{
    let data ={
      type : "conversation",
      content : newConversation
    }
    const res = await axios.post("/api/mcs/",data);
    setAddModal(false)
    setCheck(!check)
  }

  let getConversationList = async(e)=>{
    let data = {
      type:"conversation"
    }
    const res = await axios.post("/api/mcs/list",data)
    setConversationList(res.data);
  }


  useEffect(()=>{
    if(tab==="1"){
      getConversationList()
    }
  },[tab])

  return (
    <div>
        <Button onClick={toggle}>대화 주제 생성</Button>
      < Modal isOpen={addModal} toggle={toggle} >
          <ModalHeader toggle={toggle}>대화 주제 생성 폼</ModalHeader>
          <ModalBody>
            <Input type="text" placeholder="대화 주제를 기입하시오." onChange={onChangehandler}></Input>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(e)=>submitConversation(e)} >추가</Button>
            <Button color="secondary" onClick={toggle} >취소</Button>
          </ModalFooter>
        </Modal>
        <div>
          {conversationList.map((data,i)=>{
            return(
              <div>{data}</div>
            )
          })}
        </div>
  </div>
  );
};
export default Conversation;
