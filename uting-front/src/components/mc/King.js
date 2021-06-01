import React, { useState, useEffect, useContext, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import socketio, { Socket } from "socket.io-client";
import explain1 from "../../img/왕겜1.png";
import explain2 from "../../img/왕겜1.png";

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
];
const King = ({
  participantsSocketIdList,
  participants,
  gameStartFlag,
  role,
}) => {
  const [startButtonFade, setStartButtonFade] = useState(true);
  const [flag, setFlag] = useState(false);
  const [gameRole, setGameRole] = useState(role);
  const [forRole, setForRole] = useState();
  const [toExplain, setToExplain] = useState(false);
  const [explainIndex, setExplainIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  let currentUser = sessionStorage.getItem("nickname");

  var data;

  function getRandomInt(min, max) {
    //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const determineRole = async (member) => {
    var tmp = member.slice();
    var rand = getRandomInt(0, member.length);
    var objRole = {};
    objRole[`${member[rand]}`] = "왕";
    tmp.splice(rand, 1);
    for (var i = 1; i < member.length; i++) {
      rand = getRandomInt(0, tmp.length);
      objRole[`${tmp[rand]}`] = `${i}`;
      tmp.splice(rand, 1);
    }
    setForRole(objRole);
  };
  const start = async () => {
    setStartButtonFade(false);
    await determineRole(participants);
    setFlag(true);
  };

  const explain = () => {
    setToExplain(!toExplain);
  };

  const globalizeGameStart = () => {
    data = {
      gameName: "왕게임",
      socketIdList: participantsSocketIdList,
      gameNum: 2,
    };
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("gameStart", data);
  };

  const globalizeRole = () => {
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("notifyRole", {
      socketIdList: participantsSocketIdList,
      role: forRole,
    });
  };

  useEffect(async () => {
    if (flag) {
      globalizeGameStart();
      globalizeRole();
      setFlag(false);
    }
  }, [flag]);

  useEffect(() => {
    if (gameStartFlag) {
      setStartButtonFade(false);
    }
  }, [gameStartFlag]);

  useEffect(async () => {
    if (role) {
      var myRole = parsRole(role);
      setGameRole(myRole);
    }
  }, [role]);

  const parsRole = (role) => {
    for (const [key, value] of Object.entries(role)) {
      if (key === currentUser) return value;
    }
  };

  const ending = () => {
    //setTurnFlag(false);
    data = {
      socketIdList: participantsSocketIdList,
    };
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("endGame", data);
  };

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

  const slides = items.map((item, idx) => {
    return (
      <CarouselItem
        className="custom-tag"
        tag="div"
        key={item.id}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <img src={item.src} alt={item.altText} />
        <br />
        {idx === 0 ? (
          <div style={{ textAlign: "left" }}>
            <strong>1. 역할 확인</strong>
            <div>
              게임이 시작되면 화면에 자신의 역할이 나온다. 역할은 '왕'과
              '숫자'로 구분된다.
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "left" }}>
            <strong>2. 벌칙 수행</strong>
            <div>
              왕은 마음에 드는 임의의 '숫자'한테 벌칙을 지시한다. 지목된
              '숫자'는 벌칙을 수행한다.
            </div>
          </div>
        )}
      </CarouselItem>
    );
  });

  return (
    <>
      <Modal isOpen={toExplain} toggle={explain}>
        <ModalHeader toggle={explain}>귓속말 게임</ModalHeader>
        <ModalBody style={{ textAlign: "center" }}>
          <style>
            {`.custom-tag {
          max-width: 100%;
          height: 280px;
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
      {startButtonFade ? (
        <>
          <strong style={{paddingLeft:"10%"}}>왕게임</strong>
          <div
            style={{
              fontSize: "medium",
              marginTop: "10%",
              marginBottom: "10%",
            }}
          >
            무엇이든 다 할 수 있을 것만 같은 악마의 게임
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
        <div style={{ marginTop: "50px" }}>
          <strong>{gameRole}</strong>
          <br />
          {gameRole === "왕" ? (
            <Button
              outline
              color="danger"
              style={{
                border: 0,
                marginTop: "30%",
                paddingBottom: "0%",
              }}
              onClick={ending}
            >
              끝내기
            </Button>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};
export default King;
