import React, { useState, useEffect } from "react";
import defaultAxios from "../../utils/defaultAxios";
import socketio from "socket.io-client";
import explain1 from "../../img/귓말겜1.png";
import explain2 from "../../img/귓말겜2.png";
import explain3 from "../../img/귓말겜3.png";
import baseurl from "../../utils/baseurl";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledCarousel,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import "./EarInMal.css";
import { SOCKET } from "../../utils/constants";


const items = [
  //for 설명서
  {
    src: explain1,
    altText: "",
    caption: "",
  },
  {
    src: explain2,
    altText: "2. 질문 응답",
    caption: "",
  },
  {
    src: explain3,
    altText:
      "3. 질문이 궁금한 사람은 술을 마시고 질문한 사람에게 질문을 물어 볼 수 있다.",
    caption: "",
  },
];

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
  const [explainIndex, setExplainIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [getalert, setGetalert] = useState({ flag: false, message: "" });


  let toggleAlert = (e) => {
    setGetalert({ ...getalert, flag: !getalert.flag });
  };

  var data;
  let toSendSckId;
  let toSckIndex;
  let currentUser = sessionStorage.getItem("nickname");

  const next = () => {
    if (animating) return;
    const nextIndex = explainIndex === items.length - 1 ? 0 : explainIndex + 1;
    setExplainIndex(nextIndex);
  };
  const previous = () => {
    if (animating) return;
    const nextIndex = explainIndex === 0 ? items.length - 1 : explainIndex - 1;
    setExplainIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setExplainIndex(newIndex);
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const determineTurn = (member) => {
    var rand = getRandomInt(0, member.length);
    setTurn(member[rand]);
    console.log("participantsForTurn :" + participantsForTurn);
    var tmp = participantsForTurn.slice();
    tmp.splice(rand, 1);

    setParticipantsForTurn(tmp);
  };

  const start = () => {
    setIsGameStart(true);
    determineTurn(participantsForTurn);
    setFlag(true);
  };
  const globalizeGameStart = () => {
    data = {
      gameName: "귓속말게임",
      socketIdList: participantsSocketIdList,
      gameNum: 1,
    };
    const socket = socketio.connect(SOCKET);
    socket.emit("gameStart", data);
  };

  useEffect(() => {
    if (participantsForTurnSet) {
      setParticipantsForTurn(participantsForTurnSet);
    }
  }, [participantsForTurnSet]);

  useEffect(() => {
    if (gameStartFlag) {
      setIsGameStart(true);
    }
  }, [gameStartFlag]);

  const matchMemSckId = async (nickname) => {
    let tmp = [];
    tmp.push(nickname);
    const res = await defaultAxios.post("/users/usersSocketIdx", {
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
      globalizeTurn();
      setFlag(false);
    }
  }, [flag]);

  useEffect(async () => {
    if (giveTurnFlag) {
      globalizeTurn();
      setGiveTurnFlag(false);
    }
  }, [giveTurnFlag]);

  const globalizeTurn = async () => {
    await matchMemSckId(turn);
    console.log(participants);
    console.log(participantsSocketIdList);

    const socket = socketio.connect(SOCKET);
    socket.emit("notifyTurn", {
      turn: turn,
      socketIdList: participantsSocketIdList,
      remainParticipants: participantsForTurn,
    });
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
    const socket = socketio.connect(SOCKET);
    socket.emit("sendQues", data);
    setGetalert({ flag: true, message: "전송완료~!" });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
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
    const socket = socketio.connect(SOCKET);
    socket.emit("respondMsg", data);
    setGetalert({ flag: true, message: "전송완료~!" });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    setNeedToRespond(false);
  };
  const notifyQuestion = async (e) => {
    await matchMemSckId(e.target.value);
    data = {
      user: turn,
      turnSocketId: toSendSckId,
      msg: msg,
    };
    const socket = socketio.connect(SOCKET);
    socket.emit("sendMsg", data);
    setGetalert({ flag: true, message: "전송완료~!" });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
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
    const socket = socketio.connect(SOCKET);
    socket.emit("endGame", data);
  };

  const explain = () => {
    setToExplain(!toExplain);
  };

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem
        className="custom-tag"
        tag="div"
        key={item.id}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <img
          src={item.src}
          alt={item.altText}
          style={{ paddingBottom: "5%" }}
        />
        <br />
        {idx === 0 ? (
          <div style={{ textAlign: "left" }}>
            <strong>1. 질문상대 선택하고 질문하기</strong>
            <div>
              차례인 유저는 원하는 상대에게 질문을 한다. (질문은 선택된
              유저에게만 보여진다.)
            </div>
          </div>
        ) : idx === 1 ? (
          <div style={{ textAlign: "left" }}>
            <strong>2. 질문 응답</strong>
            <div>
              질문을 받은 유저는 질문에 해당하는 유저를 고르면 모든 유저에게
              응답이 알려진다.
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "left" }}>
            <strong>3. 질문 알려주기</strong>
            <div>
              질문을 한 유저는 원하는 대상에게 질문을 알려줄 수 있다.(질문이
              궁금한 사람은 술을 마시고 질문을 들을 수 있다.)
            </div>
          </div>
        )}
      </CarouselItem>
    );
  });

  return (
    <div className="EarInMal">
      <Modal isOpen={getalert.flag}>
          <ModalHeader style={{ height: "70px", textAlign: "center" }}>
            <img
              style={{
                width: "40px",
                height: "40px",
                marginLeft: "210px",
                marginBottom: "1000px",
              }}
              src={introLog}
            ></img>
          </ModalHeader>
          <ModalBody style={{ height: "90px" }}>
            <div
              style={{
                textAlign: "center",
                marginTop: "4%",
                marginBottom: "8%",
                fontFamily: "NanumSquare_acR",
                fontWeight: "bold",
                fontSize: "20px",
                height: "50px",
              }}
            >
              {getalert.message}
            </div>
          </ModalBody>
        </Modal>
      <Modal isOpen={toExplain} toggle={explain}>
        <ModalHeader toggle={explain}>귓속말 게임</ModalHeader>
        <ModalBody style={{ textAlign: "center" }}>
          <style>
            {`.custom-tag {
              max-width: 100%;
              height: 380px;
              background: white;
            }`}
          </style>
          <Carousel activeIndex={explainIndex} next={next} previous={previous}>
            <CarouselIndicators
              items={items}
              activeIndex={explainIndex}
              onClickHandler={goToIndex}
            />
            {slides}
            <CarouselControl
              direction="prev"
              directionText="Previous"
              onClickHandler={previous}
            />
            <CarouselControl
              direction="next"
              directionText="Next"
              onClickHandler={next}
            />
          </Carousel>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={explain}>
            확인
          </Button>
        </ModalFooter>
      </Modal>
      {!isGameStart ? (
        <>
          <strong style={{ paddingLeft: "10%" }}>귓속말게임</strong>
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
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gridTemplateRows: "10% 1fr 15%",
          }}
        >
          {turnFlag ? (
            <>
              {isAsked ? (
                <>
                  <h5
                    style={{
                      fontSize: "medium",
                      gridColumn: "1/5",
                    }}
                  >
                    질문 알려주기
                  </h5>
                  <div
                    style={{
                      gridColumn: "1/5",
                      gridRow: "2/3",
                    }}
                  >
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
                      gridColumn: "1/3",
                      gridRow: "3/5",
                    }}
                    onClick={giveTurn}
                  >
                    <h5 style={{ fontSize: "small" }}>턴넘기기</h5>
                  </Button>
                  <Button
                    outline
                    color="danger"
                    style={{
                      border: 0,
                      gridColumn: "3/5",
                      gridRow: "3/5",
                    }}
                    onClick={ending}
                  >
                    <h5 style={{ fontSize: "small" }}>게임끝</h5>
                  </Button>
                </>
              ) : (
                <>
                  <h5 style={{ fontSize: "medium", gridColumn: "1/5" }}>
                    질문할 사용자 선택
                  </h5>
                  <div style={{ gridColumn: "1/5", girdRow: "1/3" }}>
                    {participants.map((member, index) => (
                      <Button
                        outline
                        color="secondary"
                        style={{
                          border: 0,
                          padding: "0px",
                          marginRight: "5%",
                        }}
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
                  <div style={{ gridColumn: "1/5", gridRow: "2" }}>
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
                      gridColumn: "1/5",
                    }}
                  >
                    Turn : {turn}님
                  </div>
                  <div style={{ gridColumn: "1/5" }}>차례를 기다리세요</div>
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
