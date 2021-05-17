import React, { useState, useEffect, useContext, Fragment } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import socketio, { Socket } from "socket.io-client";
import { Button } from "reactstrap";
import "./EarInMal.css";
import { RealtimeVolumeIndicator } from "amazon-chime-sdk-js";
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
  const [questionedUser, setQuestionedUser] = useState();
  const [participantsForTurn, setParticipantsForTurn] = useState(participants);
  const socket = socketio.connect("http://localhost:3001");
  var data;
  let toSendSckId;

  function getRandomInt(min, max) {
    //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const determineTurn = (member) => {
    var rand = getRandomInt(0, member.length);
    setTurn(member[rand]);
    let tmp = participantsForTurn.slice();
    tmp.splice(rand, rand);
    setParticipantsForTurn(tmp);
  };

  const start = () => {
    setStartButtonFade(false);
    setFlag(true);
    determineTurn(participantsForTurn);
  };

  useEffect(() => {
    console.log("flag : " + flag);
    if (flag) {
      data = { gameName: "귓속말게임", socketIdList: participantsSocketIdList };
      const socket = socketio.connect("http://localhost:3001");
      console.log("socket data : ");
      console.log(data);
      socket.emit("gameStart", data);
      console.log("gameStart socket emit!!");
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
    console.log("matchMem -ing ");
    console.log("tmp : " + tmp);
    const res = await axios.post("http://localhost:3001/users/usersSocketId", {
      users: tmp,
    });
    if (res.status == 200) {
      console.log("data[0] : " + data);
      toSendSckId = res.data;
    }
  };

  useEffect(async () => {
    console.log("turn & gameTurn : " + turn + " " + gameTurn);
    if (turn) {
      //(turn && !gameTurn)
      //게임 스타트를 직접 누른 경우에만 실행
      console.log("뷁 ");

      await matchMemSckId(turn);
      console.log(participants);
      console.log(participantsSocketIdList);
      //const socket = socketio.connect("http://localhost:3001");
      socket.emit("notifyTurn", {
        turn: turn,
        socketIdList: participantsSocketIdList,
      });
      socket.emit("notifyMember", { turnSocketId: toSendSckId });
    }
  }, [turn]);

  useEffect(() => {
    setMyTurnFlag(isTurn);
  }, [isTurn]);
  useEffect(() => {
    if (gameTurn) {
      setTurn(gameTurn);
    }
  }, [gameTurn]);

  useEffect(() => {
    console.log("participatns : " + participantsSocketIdList);
  }, [participants]);

  useEffect(() => {
    setIsNextTurn(nextTurnFlag);
    console.log("isNextTurn : " + isNextTurn);
  }, [nextTurnFlag]); //message받고나서

  const updateField = (e) => {
    let { name, value } = e.target;
    console.log(value);
    setMsg(value);
  };
  const sendMsg = async (e) => {
    e.preventDefault();
    console.log("nextTurnUser : " + questionedUser);

    await matchMemSckId(questionedUser);

    data = {
      user: turn,
      turnSocketId: toSendSckId,
      msg: msg,
    };
    console.log("data : ");
    console.log(data);
    //const socket = socketio.connect("http://localhost:3001");
    socket.emit("sendMsg", data);
    console.log("sendMsg");
    alert("전송완료!");
    //setMyTurnFlag(false);  <<이거 답변받고 false로 해야된다!
    //toggleMsgModalFlag();
    setIsAsked(true);
  };

  const choosenextTurnUser = (e) => {
    setMsgModalFlag(true);
    setQuestionedUser(e.target.value);
  };
  const respond = async (e) => {
    data = {
      user: turn,
      socketIdList: participantsSocketIdList,
      msg: e.target.value,
    };
    //const socket = socketio.connect("http://localhost:3001");
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
    //const socket = socketio.connect("http://localhost:3001");
    socket.emit("sendMsg", data);
    alert("전송완료~!");
  };

  const giveTurn = () => {
    gameTurn = null;
    determineTurn(participantsForTurn);

    setIsAsked(false); //turn이었던 사람 state 초기화
    setMyTurnFlag(false);
    setIsNextTurn(false);
  };

  const ending = () => {};

  return (
    <div className="EarInMal">
      {startButtonFade ? (
        <Button outline color="secondary" style={{ border: 0 }} onClick={start}>
          귓속말게임시작
        </Button>
      ) : (
        <div>
          {myturnFlag ? (
            <div>
              {isAsked ? (
                <>
                  <h5 style={{ fontSize: "small" }}>질문 알려주기</h5>
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
                  <Button
                    outline
                    color="danger"
                    style={{ border: 0, float: "left", padding: "5px" }}
                    onClick={giveTurn}
                  >
                    턴 넘기기
                  </Button>
                  <Button
                    outline
                    color="danger"
                    style={{ border: 0, float: "right", padding: "5px" }}
                    onClick={ending}
                  >
                    게임 끝
                  </Button>
                </>
              ) : (
                <>
                  <h5 style={{ fontSize: "medium" }}>질문할 사용자 선택</h5>
                  <div>
                    {participants.map((member, index) => (
                      <Button
                        outline
                        color="secondary"
                        style={{ border: 0 }}
                        key={index}
                        value={member}
                        onClick={choosenextTurnUser}
                      >
                        {member}
                      </Button>
                    ))}

                    {msgModalFlag ? (
                      <form onSubmit={sendMsg}>
                        <label>
                          질문:
                          <input name="msg" onChange={(e) => updateField(e)} />
                        </label>
                        <button>Submit</button>
                      </form>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              )}
              <br />
            </div>
          ) : (
            <div>
              {isNextTurn ? (
                <div>
                  질문에 응답하기
                  {participants.map((member, index) => (
                    <button key={index + 10} value={member} onClick={respond}>
                      {member}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "medium", float: "left" }}>
                    Turn : {turn}님
                  </div>
                  <br />
                  차례를 기다리세요
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
