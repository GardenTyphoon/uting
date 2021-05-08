import React, { useState, useEffect, useContext } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import socketio, { Socket } from "socket.io-client";
import { SocketContext } from "../../routes/context/socket";

//일단 필요한게 미팅원 전체의 socketid가 다필요하고 누른애랑 그 키값으로 가져와야할듯
//키값으로 가져오면 해당애 검사 띡해서 socketㅑ
const EarInMal = ({ groupSocketIdList, currentSocketId, groupMember }) => {
  const socket = useContext(SocketContext);

  //let sessionUser = sessionStorage.getItem("nickname");
  const [buttonFade, SetButtonFade] = useState(true);
  const [content, setContent] = useState();
  const [member, setMember] = useState(groupMember);
  const [leftMember, setLeftMember] = useState(groupMember);
  const [turnFlag, setTurnFlag] = useState(false);
  const [myturnFlag, setMyTurnFlag] = useState(false);
  var turn;

  let currentUser = sessionStorage.getItem("nickname");
  var data;
  function getRandomInt(min, max) {
    //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
  }
  var isMyTurn = () => {
    if (turn == currentUser) {
      console.log("it's my turn");
      setMyTurnFlag(true);
      return true;
    }
    return false;
  };
  const determineTurn = (leftmember) => {
    var rand = getRandomInt(0, leftMember.length);
    turn = leftmember[rand];
    if (isMyTurn()) setTurnFlag(true);
  };

  const start = async () => {
    SetButtonFade(!buttonFade);
    console.log("member" + groupMember);
    if (!leftMember.length) {
      setLeftMember(groupMember);
    }
    determineTurn(leftMember);
    let res = await axios.post("http://localhost:3001/users/usersSocketId", {
      users: groupMember,
    });
    data = { turn: turn, socketIdList: groupSocketIdList };
    console.log(data);
    socket.emit("notifyTurn", data);
  };

  useEffect(() => {
    //if (turnFlag) {
    var turnIdx;
    console.log("turnflag useEffect!");
    groupMember.map((member, index) => {
      if (member == turn) turnIdx = index;
    });
    data = { turnSocketId: groupSocketIdList[turnIdx] };
    socket.emit("notifyMember", data);
  }, [turnFlag]);

  /*while (stop)
    group.map((turn)=>{
        turn. 
    })
    방에 있는 사람들중에 한명 선택 
    //방에 있는 그룹원 띄우기
    //*/

  return (
    <div>
      {buttonFade ? (
        <button onClick={start}>귓속말게임</button>
      ) : (
        <div>
          {myturnFlag ? <div>myturn</div> : <div>ㅊㅏㄹㅖㄹㅡㄹㄱㅣㄷㅏ</div>}
        </div>
      )}
    </div>
  );
};
export default EarInMal;
