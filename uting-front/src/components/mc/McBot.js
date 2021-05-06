import React, { useState, useEffect } from 'react';
import { Route, Link, Switch, Router } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import McBotImg from '../../img/mc봇.png';
import backImg from '../../img/뒤로가기.svg'
import renewImg from '../../img/새로고침.svg'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Modal,ModalBody,ModalHeader,Fade } from 'reactstrap';

const Box = styled.div`
  border: 1.5px solid rgb(221, 221, 221);
  border-radius: 7px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  background-color: white;
  width:200px;
  height:200px;
`;
const McBot = ({groupSocketIdList,currentSocketId,groupMember}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contentFade, setContentFade] = useState(false);
  
  const [number,setNumber]=useState("");
  const [content,setContent] = useState("")

  

  const toggle = (e) => {
    setDropdownOpen(prevState => !prevState)
    if(dropdownOpen===true){
      setContentFade(true)
    }
    if(dropdownOpen===false){
      setContentFade(false)
    }
  };
  
  let back =(e)=>{
    setContentFade(false)
    setDropdownOpen(true)
  }

  let getGame = async(e)=>{
    let data = {
      type:"game"
    }
    const res = await axios.post("http://localhost:3001/mcs/list",data)

    //랜덤값생성
    let index = Math.floor(Math.random()*res.data.length)
    setContent(res.data[index])
  }

  let getTopic = async(e)=>{
    let data = {
      type:"conversation"
    }
    const res = await axios.post("http://localhost:3001/mcs/list",data)
    //랜덤값생성
    let index = Math.floor(Math.random()*res.data.length)
    setContent(res.data[index])
  }

  const FadeToggle =(e)=>{
    setNumber(e)
    setContentFade(!contentFade)
    if(e===1 && contentFade===false){
      getGame();
    }
    if(e===2 && contentFade===false){
      getTopic();
    }
    if(e===3 && contentFade===false){
      //음악
      setContent("음악!")
    }
    if(e===4 && contentFade===false){
      //실시간게임
      setContent("마피아할거임~~~~~~~~~~~~?")
    }
  }
  return (
    <div>


      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret style={{ width:"15%", backgroundColor: "transparent", border: "0px" }}>
          <img src={McBotImg} style={{ width: "80%" }} />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={(e)=>FadeToggle(1)}>게임 추천</DropdownItem>
          <DropdownItem onClick={(e)=>FadeToggle(2)}>대화 추천</DropdownItem>
          <DropdownItem onClick={(e)=>FadeToggle(3)}>음악 재생</DropdownItem>
          <DropdownItem onClick={(e)=>FadeToggle(4)}>실시간 게임</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      
      <Fade in={contentFade} tag="h5" className="mt-3">
      <Box>
      <img onClick={(e)=>back(e)} src={backImg} style={{width:"12%"}}></img>
        {number===1?
        <img onClick={(e)=>getGame(e)} src={renewImg} style={{width:"12%",marginLeft:"130px"}}></img>
      :number===2?
        <img onClick={(e)=>getTopic(e)} src={renewImg} style={{width:"12%",marginLeft:"130px"}}></img>
        :number===3?
          <div></div>
        :number===4?
        <div></div>
        :""
        }<div style={{marginTop:"50px",marginLeft:"50px"}}>{content}</div>
        </Box>
      </Fade>
    </div>
  );
};
export default McBot;
