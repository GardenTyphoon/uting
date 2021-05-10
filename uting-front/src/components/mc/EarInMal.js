import React, { useState, useEffect, useContext } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import socketio, { Socket } from "socket.io-client";

//일단 필요한게 미팅원 전체의 socketid가 다필요하고 누른애랑 그 키값으로 가져와야할듯
//키값으로 가져오면 해당애 검사 띡해서 socketㅑ

const EarInMal = ({
  participantsSocketIdList,
  currentSocketId,
  participants,
  isTurn,
  nextTurnFlag,
  respondFormFlag,
  gameStartFlag,
  gameTurn,
}) => {
  const socket = socketio.connect("http://localhost:3001");

  //let sessionUser = sessionStorage.getItem("nickname");
  const [startButtonFade, setStartButtonFade] = useState(true); //시작버튼
  //const [content, setContent] = useState(false);
  const [myturnFlag, setMyTurnFlag] = useState(isTurn);
  const [turn, setTurn] = useState(gameTurn);
  const [msgModalFlag, setMsgModalFlag] = useState(false);
  const [msg, setMsg] = useState();
  const [nextTurnUser, setnextTurnUser] = useState();
  const [isNextTurn, setIsNextTurn] = useState(nextTurnFlag);
  const [flag, setFlag] = useState(false);
  const [gameStart, setGameStart] = useState(gameStartFlag);
  const [isAsked, setIsAsked] = useState(false);

  let currentUser = sessionStorage.getItem("nickname");
  var data;
  let toSendSckId;
  function getRandomInt(min, max) {
    //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const determineTurn = (member) => {
    var rand = getRandomInt(0, member.length);
    setTurn(member[0]);
  };

  const start = () => {
    setStartButtonFade(false);
    setFlag(true);
    determineTurn(participants);
  };

  useEffect(() => {
    if (flag) {
      data = { gameName: "귓속말게임", socketIdList: participantsSocketIdList };
      socket.emit("gameStart", data);
    }
  }, [flag]);

  useEffect(() => {
    setGameStart(gameStartFlag);
    if (gameStartFlag) {
      setStartButtonFade(false);
    }
  }, [gameStartFlag]);

  const matchMemSckId = async (nickname) => {
    let tmp = [];
    tmp.push(nickname);
    let res = await axios
      .post("http://localhost:3001/users/usersSocketId", {
        users: tmp,
      })
      .then((res) => res.data)
      .then((data) => {
        {
          console.log("data[0] : " + data);
          toSendSckId = data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(async () => {
    if (turn && !gameTurn) {
      //게임 스타트를 직접 누른 경우에만 실행
      await matchMemSckId(turn);
      console.log(participants);
      console.log(participantsSocketIdList);
      data = { turn: turn, socketIdList: participantsSocketIdList };
      socket.emit("notifyTurn", data);
      data = { turnSocketId: toSendSckId };
      socket.emit("notifyMember", data);
    }
  }, [turn]);

  useEffect(() => {
    setMyTurnFlag(isTurn);
  }, [isTurn]);
  useEffect(() => {
    setTurn(gameTurn);
  }, [gameTurn]);

  useEffect(() => {
    setIsNextTurn(nextTurnFlag);
  }, [nextTurnFlag]); //message받고나서

  const updateField = (e) => {
    setMsg(e.target.value);
  };
  const sendMsg = async (e) => {
    e.preventDefault();
    await matchMemSckId(nextTurnUser);
    data = {
      user: turn,
      turnSocketId: toSendSckId,
      msg: msg,
    };
    socket.emit("sendMsg", data);
    alert("전송완료!");
    //setMyTurnFlag(false);  <<이거 답변받고 false로 해야된다!
    setMsgModalFlag(false);
    setIsAsked(true);
  };
  const choosenextTurnUser = (e) => {
    setMsgModalFlag(true);
    setnextTurnUser(e.target.value);
  };
  const respond = async (e) => {
    data = {
      user: turn,
      socketIdList: participantsSocketIdList,
      msg: e.target.value,
    };
    socket.emit("respondMsg", data);
    alert("전송완료!");
    setIsNextTurn(false);
  };
  const notifyQuestion = async (e) => {
    await matchMemSckId(e.target.value);
    data = {
      user: turn,
      turnSocketId: toSendSckId,
      msg: msg,
    };
    socket.emit("sendMsg", data);
    alert("전송완료~!");
  };

  return (
    <div>
      {startButtonFade ? (
        <button onClick={start}>귓속말게임시작</button>
      ) : (
        <div>
          {myturnFlag ? (
            <div>
              {isAsked ? (
                <div>
                  {participants.map((member) => (
                    <button
                      key={member.index}
                      value={member}
                      onClick={notifyQuestion}
                    >
                      {member}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  질문하기
                  {participants.map((member) => (
                    <button
                      key={member.index}
                      value={member}
                      onClick={choosenextTurnUser}
                    >
                      {member}
                    </button>
                  ))}
                  {msgModalFlag ? (
                    <form onSubmit={sendMsg}>
                      <label>
                        질문:
                        <input name="msg" onChange={updateField} />
                      </label>
                      <button>Submit</button>
                    </form>
                  ) : (
                    <div></div>
                  )}
                </div>
              )}

              <button> 게임 끝내기 </button>
            </div>
          ) : (
            <div>
              {isNextTurn ? (
                <div>
                  {participants.map((member) => (
                    <button key={member.index} value={member} onClick={respond}>
                      {member}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div>Turn : {turn}님</div> 차례를 기다리세요~
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default EarInMal;
