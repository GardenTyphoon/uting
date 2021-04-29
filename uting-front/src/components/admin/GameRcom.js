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
    Row,TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';


    const RightButton = styled.div`
    position: relative;
    padding: 1rem 1rem;
    margin: -1rem -1rem -1rem auto;
  `;

  const FlexBox = styled.div`
  display: flex;
`;

const GameRecom = () => {
  const [addModal, setAddModal] = useState(false);
  const [newGame,setNewGame]=useState("")
  const [gameList,setGameList]=useState([]);
  const [check,setCheck]=useState(false);

  const toggle = () => {
    setAddModal(!addModal);
  }

  let onChangehandler = (e) => {
    let { name, value } = e.target;
    setNewGame(value)
  };

  let submitConversation = async(e) =>{
    let data ={
      type : "game",
      content : newGame
    }
    const res = await axios.post("http://localhost:3001/mcs/",data);
    console.log(data)
    setAddModal(false)
    setCheck(!check)
  }

  let getGameList = async(e)=>{
    let data = {
      type:"game"
    }
    const res = await axios.post("http://localhost:3001/mcs/list",data)
    console.log(res.data)
    setGameList(res.data);
  }

  useEffect(()=>{
    getGameList()
  },[])

  useEffect(()=>{
    getGameList()
  },[check])

  return (
    <div>
        게임주제
        <Button onClick={toggle}>게임 주제 생성</Button>
      < Modal isOpen={addModal} toggle={toggle} >
          <ModalHeader toggle={toggle}>게임 주제 생성 폼</ModalHeader>
          <ModalBody>
            <Input type="text" placeholder="게임 주제를 기입하시오." onChange={onChangehandler}></Input>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(e)=>submitConversation(e)} >추가</Button>
            <Button color="secondary" onClick={toggle} >취소</Button>
          </ModalFooter>
        </Modal>
        <div>
          {gameList.map((data,i)=>{
            return(
              <div>{data}</div>
            )
          })}
        </div>
  </div>
  );
};
export default GameRecom;
