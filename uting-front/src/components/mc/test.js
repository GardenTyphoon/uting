import React, { useState, useEffect } from "react";
import axios from "axios";
import socketio from "socket.io-client";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "./EarInMal.css";

const EarInMal = ({
  participantsSocketIdList,
  currentSocketId,
  participants,
  isTurn,
  respondFlag,
  respondFormFlag,
  gameStartFlag,
  gameTurn,
  question,
  participantsForTurnSet,
}) => {
  const [isGameStart, setIsGameStart] = useState(false); //시작버튼
  const [turn, setTurn] = useState(gameTurn);
  const [msgModalFlag, setMsgModalFlag] = useState(false);
  const [msg, setMsg] = useState();
  const [needToRespond, setNeedToRespond] = useState(respondFlag);
  const [turnFlag, setTurnFlag] = useState(isTurn);
  const [isAsked, setIsAsked] = useState(false);
  const [questionedUser, setQuestionedUser] = useState();
  const [participantsForTurn, setParticipantsForTurn] = useState(participants);
  const [flag, setFlag] = useState(false);
  const [giveTurnFlag, setGiveTurnFlag] = useState(false);
  const [toExplain, setToExplain] = useState(false);
  var data;
  let toSendSckId;
  let toSckIndex;
  let currentUser = sessionStorage.getItem("nickname");
  function getRandomInt(min, max) {
    //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const determineTurn = (member) => {
    var rand = getRandomInt(0, member.length);
    setTurn(member[rand]);
    console.log("participantsForTurn :" + participantsForTurn); //for debug
    var tmp = participantsForTurn.slice();
    tmp.splice(rand, 1);
    //console.log("tmp : " + tmp);
    setParticipantsForTurn(tmp);
  };

  const start = () => {
    setIsGameStart(true);
    determineTurn(participantsForTurn);
    setFlag(true);
  };

  /*useEffect(() => {
    if (!startButtonFade) {
      data = { gameName: "귓속말게임", socketIdList: participantsSocketIdList };
      const socket = socketio.connect("http://localhost:3001");
      socket.emit("gameStart", data);
    }
  }, [startButtonFade]);*/

  const globalizeGameStart = () => {
    data = { gameName: "귓속말게임", socketIdList: participantsSocketIdList };
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("gameStart", data);
  };

  useEffect(() => {
    //console.log("participantsForTurnSet :" + participantsForTurn);
    if (participantsForTurnSet) {
      setParticipantsForTurn(participantsForTurnSet);
    }
  }, [participantsForTurnSet]);

  /*useEffect(() => {
    console.log("participantsForTurn :" + participantsForTurn); //for debug
  }, [participantsForTurn]);*/

  useEffect(() => {
    if (gameStartFlag) {
      setIsGameStart(true);
    }
  }, [gameStartFlag]);

  const matchMemSckId = async (nickname) => {
    let tmp = [];
    tmp.push(nickname);
    const res = await axios.post("http://localhost:3001/users/usersSocketIdx", {
      users: tmp,
    });
    if (res.status == 200) {
      toSendSckId = res.data[0];
      toSckIndex = res.data[1];
    }
  };

  useEffect(async () => {
    if (flag) {
      globalizeGameStart();
      globalizeTurn(); //+
      setFlag(false);
    }
  }, [flag]);

  useEffect(async () => {
    if (giveTurnFlag) {
      globalizeTurn(); //+
      setGiveTurnFlag(false);
    }
  }, [giveTurnFlag]);

  const globalizeTurn = async () => {
    await matchMemSckId(turn);
    console.log(participants);
    console.log(participantsSocketIdList);

    const socket = socketio.connect("http://localhost:3001");
    socket.emit("notifyTurn", {
      turn: turn,
      socketIdList: participantsSocketIdList,
      remainParticipants: participantsForTurn,
    });
    socket.emit("notifyMember", { turnSocketId: toSendSckId });
  };

  useEffect(() => {
    setTurnFlag(isTurn);
  }, [isTurn]);

  useEffect(() => {
    setTurn(gameTurn);
    console.log("gameTurn : " + gameTurn);
    console.log("currentUser : " + currentUser);
    if (gameTurn === currentUser) {
      setTurnFlag(true);
    }
  }, [gameTurn]);

  useEffect(() => {
    setNeedToRespond(respondFlag);
  }, [respondFlag]); //message받고나서

  const updateField = (e) => {
    let { name, value } = e.target;
    setMsg(value);
  };
  const sendQues = async (e) => {
    e.preventDefault();
    await matchMemSckId(questionedUser);
    data = {
      user: turn,
      turnSocketId: toSendSckId,
      msg: msg,
    };
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("sendQues", data);
    alert("전송완료!");
    setMsgModalFlag(false);
    setIsAsked(true);
  };

  const questionToWhom = (e) => {
    setMsgModalFlag(true);
    setQuestionedUser(e.target.value);
  };
  const respond = async (e) => {
    data = {
      user: turn,
      socketIdList: participantsSocketIdList,
      msg: e.target.value,
    };
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("respondMsg", data);
    alert("전송완료!");
    setNeedToRespond(false);
  };
  const notifyQuestion = async (e) => {
    await matchMemSckId(e.target.value);
    data = {
      user: turn,
      turnSocketId: toSendSckId,
      msg: msg,
    };
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("sendMsg", data);
    alert("전송완료~!");
  };

  const giveTurn = async () => {
    await matchMemSckId(turn);
    if (participantsForTurn.length === 0) {
      //멤버 한바퀴 다돌아서 새롭게 랜덤 턴 시
      let tmp = participants.slice();
      tmp.splice(toSckIndex, 1);
      console.log("determine with participants : " + tmp);
      await determineTurn(tmp);
    } else {
      await determineTurn(participantsForTurn);
    }
    setGiveTurnFlag(true);
    setTurnFlag(false);
    setIsAsked(false);
  };

  const ending = () => {
    setTurnFlag(false);
    data = {
      socketIdList: participantsSocketIdList,
    };
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("endGame", data);
  };

  const explain = () => {
    setIsGameStart(true);
    setToExplain(true);
  };

  return (
    <div className="EarInMal">
      <Modal isOpen={toExplain} toggle={explain}>
        <ModalHeader toggle={explain}>Modal title</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={explain}>
            Do Something
          </Button>
          <Button color="secondary" onClick={explain}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {!isGameStart ? (
        <>
          <strong>귓속말게임</strong>
          <div
            style={{
              fontSize: "medium",
              marginTop: "10%",
              marginBottom: "10%",
            }}
          >
            걸스데이 유라가 꼽은 '최고의 술자리 게임'
          </div>
          <Button
            outline
            color="secondary"
            style={{ border: 0 }}
            onClick={start}
          >
            게임시작
          </Button>
          <Button
            outline
            color="secondary"
            style={{ border: 0 }}
            onClick={explain}
          >
            설명
          </Button>
        </>
      ) : (
        <div
          style={{
            display: "grid",
            width: "170px",
            height: "160px",
            gridTemplateColumns: "1.5fr 1.2fr 1.5fr",
            gridTemplateRows: "0.5fr 2fr 15%",
          }}
        >
          {turnFlag ? (
            <>
              {isAsked ? (
                <>
                  <h5
                    style={{
                      fontSize: "medium",
                      gridColumn: "1/4",
                    }}
                  >
                    질문 알려주기
                  </h5>
                  <div style={{ gridColumn: "1/4", gridRow: "2/3" }}>
                    {participants.map((member) => (
                      <Button
                        outline
                        color="secondary"
                        style={{ border: 0, padding: "5px" }}
                        key={member.index}
                        value={member}
                        onClick={notifyQuestion}
                      >
                        {member}
                      </Button>
                    ))}
                  </div>
                  <Button
                    outline
                    color="danger"
                    style={{
                      border: 0,
                      float: "left",
                      padding: "10px",
                      gridColumn: "1/2",
                      gridRow: "3/5",
                    }}
                    onClick={giveTurn}
                  >
                    <h5 style={{ fontSize: "small" }}>턴 넘기기</h5>
                  </Button>
                  <Button
                    outline
                    color="danger"
                    style={{
                      border: 0,
                      gridColumn: "3/4",
                      gridRow: "3/5",
                    }}
                    onClick={ending}
                  >
                    <h5 style={{ fontSize: "small" }}>게임끝</h5>
                  </Button>
                </>
              ) : (
                <>
                  <h5 style={{ fontSize: "medium", gridColumn: "1/4" }}>
                    질문할 사용자 선택
                  </h5>
                  <div style={{ gridColumn: "1/4", girdRow: "2/3" }}>
                    {participants.map((member, index) => (
                      <Button
                        outline
                        color="secondary"
                        style={{ border: 0 }}
                        key={index}
                        value={member}
                        onClick={questionToWhom}
                      >
                        {member}
                      </Button>
                    ))}

                    {msgModalFlag ? (
                      <form onSubmit={sendQues}>
                        <Input
                          name="msg"
                          placeholder="질문"
                          onChange={(e) => updateField(e)}
                        />

                        <Button outline color="success" style={{ border: 0 }}>
                          질문하기
                        </Button>
                      </form>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              )}
              <br />
            </>
          ) : (
            <>
              {needToRespond ? (
                <>
                  <div
                    style={{
                      fontSize: "large",
                      gridColumn: "1/5",
                    }}
                  >
                    {question}
                  </div>
                  <div style={{ gridColumn: "1/4", gridRow: "2" }}>
                    {participants.map((member, index) => (
                      <Button
                        outline
                        color="secondary"
                        style={{ border: 0 }}
                        key={index + 10}
                        value={member}
                        onClick={respond}
                      >
                        {member}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: "medium",
                      float: "left",
                      gridColumn: "1/3",
                    }}
                  >
                    Turn : {turn}님
                  </div>
                  <div style={{ gridColumn: "1/4" }}>차례를 기다리세요</div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default EarInMal;
