import React, { useState, useEffect, useContext } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import defaultAxios from "../../utils/defaultAxios";
import styled from "styled-components";
import McBotImg from "../../img/mc봇.png";
import backImg from "../../img/뒤로가기.svg";
import renewImg from "../../img/새로고침.svg";
import playImg from "../../img/음악재생.svg";
import pauseImg from "../../img/음악정지.png";
import EarInMal from "./EarInMal";
import King from "./King";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalHeader,
  Fade,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Button,
  ButtonGroup,
  ModalFooter,
} from "reactstrap";
import ReactAudioPlayer from "react-audio-player";
import socketio from "socket.io-client";
import baseurl from "../../utils/baseurl";

const Box = styled.div`
  border: 2px solid rgb(255, 255, 255);
  border-radius: 7px;
  margin-bottom: 10px;
  padding: 10px;
  background: linear-gradient(to bottom, #ffd5d5, #ddf5ff);
  width: 200px;
  height: 270px;
  font-size: large;
  font-weight: 500;
`;

const HashTag = styled.button`
  font-family: NanumSquare_acR;
  background: transparent;
  border: 0px;
  font-size: medium;
  margin-left: 4%;
  padding-left: 1%;
  padding-right: 3%;
  padding-bottom: 1%;
  padding-top: 2%;
`;
const McBot = ({
  participantsSocketIdList,
  currentSocketId,
  participants,
  respondFlag,
  gameStartFlag,
  gameTurn,
  question,
  participantsForTurn,
  intervalFade,
  role,
  gameNum_2,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contentFade, setContentFade] = useState(false);
  const [number, setNumber] = useState("");
  const [content, setContent] = useState("");
  const [musicpath, setMusicpath] = useState("");
  const [gameStart, setGameStart] = useState(gameStartFlag);
  const [gameNum, setGameNum] = useState(gameNum_2);

  const toggle = (e) => {
    setDropdownOpen((prevState) => !prevState);
    if (dropdownOpen === false) {
      setContentFade(false);
    }
  };

  let back = (e) => {
    setContentFade(false);
    setDropdownOpen(true);
  };

  let getGame = async (e) => {
    let data = {
      type: "game",
    };
    const res = await defaultAxios.post("/mcs/list", data);

    //랜덤값생성
    let index = Math.floor(Math.random() * res.data.length);
    setContent(res.data[index]);
  };

  let getTopic = async (e) => {
    let data = {
      type: "conversation",
    };
    const res = await defaultAxios.post("/mcs/list", data);
    //랜덤값생성
    let index = Math.floor(Math.random() * res.data.length);
    setContent(res.data[index]);
  };

  let getMusicName = (e) => {
    const socket = socketio.connect(`${baseurl.baseBack}`);
    if (e === 1) {
      console.log(e);
      console.log(participantsSocketIdList);
      socket.emit("musicplay", {
        socketIdList: participantsSocketIdList,
        src: "/music/신남/SellBuyMusic신남1.mp3",
      });
    }
    if (e === 2) {
      socket.emit("musicplay", {
        socketIdList: participantsSocketIdList,
        src: "/music/설렘/SellBuyMusic설렘1.mp3",
      });
    }
    if (e === 3) {
      socket.emit("musicplay", {
        socketIdList: participantsSocketIdList,
        src: "/music/잔잔/SellBuyMusic잔잔1.mp3",
      });
    }
  };

  let pause = () => {
    const socket = socketio.connect(`${baseurl.baseBack}`);
    socket.emit("musicpause", { socketIdList: participantsSocketIdList });
  };

  let play = () => {
    const socket = socketio.connect(`${baseurl.baseBack}`);
    socket.emit("replay", { socketIdList: participantsSocketIdList });
  };

  const FadeToggle = (e) => {
    setNumber(e);
    setContentFade(!contentFade);
    if (e === 1 && contentFade === false) {
      getGame();
    }
    if (e === 2 && contentFade === false) {
      getTopic();
    }
    if (e === 3 && contentFade === false) {
      //음악
      setContent("");
    }
    if (e === 4 && contentFade === false) {
      setGameNum(0);
      setContent("");
      //실시간게임
    }
  };

  useEffect(() => {
    if (gameNum_2) {
      setGameNum(gameNum_2);
      //console.log("gameNum start~!~! : " + gameNum_2);
    }
  }, [gameNum_2]);

  useEffect(() => {
    setGameStart(gameStartFlag);
  }, [gameStartFlag]);

  useEffect(() => {
    if (gameNum === 1) {
      setContentFade(true);
      setNumber(4);
      setGameNum(1);
    } else if (gameNum === 2) {
      setContentFade(true);
      setNumber(4);
      setGameNum(2);
    } else {
      setContentFade(false);
      setNumber(0);
      setGameNum(0);
    }
  }, [gameNum]);

  useEffect(() => {
    if (intervalFade !== 0) {
      if (intervalFade === 1) {
        setDropdownOpen(false);
        setContentFade(true);
        setNumber(1);
        getGame();
      } else if (intervalFade === 2) {
        setDropdownOpen(false);
        setContentFade(true);
        setNumber(2);
        getTopic();
      } else if (intervalFade === 3) {
        setDropdownOpen(false);
        setContentFade(true);
        setNumber(3);
        setContent("");
      } else if (intervalFade === 4) {
        setDropdownOpen(false);
        setContentFade(true);
        setNumber(4);
        setContent("");
      }
    }
  }, [intervalFade]);

  const [modal, setModal] = useState(false);
  const toogleERR = () => setModal(!modal);

  return (
    <div>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        style={{ width: "90px", margin: "0px" }}
      >
        <DropdownToggle
          caret
          style={{
            width: "15%",
            backgroundColor: "transparent",
            border: "0px",
            outline: "none",
          }}
          src={McBotImg}
        >
          <img src={McBotImg} style={{ width: "120px", float: "left" }} />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={(e) => FadeToggle(1)}>게임 추천</DropdownItem>
          <DropdownItem onClick={(e) => FadeToggle(2)}>대화 추천</DropdownItem>
          <DropdownItem onClick={(e) => FadeToggle(3)}>음악 재생</DropdownItem>
          <DropdownItem onClick={(e) => FadeToggle(4)}>
            실시간 게임
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Fade in={contentFade}>
        <Box>
          <img
            onClick={(e) => back(e)}
            src={backImg}
            style={{
              width: "12%",
              float: "left",
              margin: "2px",
              marginRight: "120px",
            }}
          ></img>
          {number === 1 ? (
            <>
              <img
                onClick={(e) => getGame(e)}
                src={renewImg}
                style={{ width: "12%" }}
              ></img>
            </>
          ) : number === 2 ? (
            <img
              onClick={(e) => getTopic(e)}
              src={renewImg}
              style={{ width: "12%" }}
            ></img>
          ) : number === 3 ? (
            <div>
              <div style={{ margin: "10px" }}>
                <HashTag onClick={(e) => getMusicName(1)}>#신남</HashTag>
                <HashTag onClick={(e) => getMusicName(2)}>#설렘</HashTag>
                <HashTag onClick={(e) => getMusicName(3)}>#잔잔</HashTag>
              </div>
              <div style={{}}>
                <span onClick={(e) => play()}>
                  <img
                    style={{ width: "25%", margin: "10px" }}
                    src={playImg}
                  ></img>
                </span>
                <span onClick={(e) => pause()}>
                  <img
                    style={{ width: "25%", margin: "10px" }}
                    src={pauseImg}
                  ></img>
                </span>
              </div>
            </div>
          ) : number === 4 ? (
            <div
              style={{
                alignItems: "center",
              }}
            >
              {gameNum === 0 ? (
                <>
                  <ButtonGroup vertical>
                    <Button
                      outline
                      color="secondary"
                      style={{ border: 0 }}
                      onClick={() => setGameNum(1)}
                    >
                      귓속말 게임
                    </Button>
                    <Button
                      outline
                      color="secondary"
                      style={{ border: 0 }}
                      onClick={() => setGameNum(2)}
                    >
                      왕게임
                    </Button>
                    <Button outline color="secondary" style={{ border: 0 }}>
                      라이어게임
                    </Button>
                  </ButtonGroup>
                </>
              ) : gameNum === 1 ? (
                <>
                  <EarInMal
                    participantsSocketIdList={participantsSocketIdList}
                    currentSocketId={currentSocketId}
                    participants={participants}
                    respondFlag={respondFlag}
                    gameStartFlag={gameStart}
                    gameTurn={gameTurn}
                    question={question}
                    participantsForTurnSet={participantsForTurn}
                  />
                </>
              ) : gameNum === 2 ? (
                <>
                  <King
                    participantsSocketIdList={participantsSocketIdList}
                    currentSocketId={currentSocketId}
                    participants={participants}
                    respondFlag={respondFlag}
                    gameStartFlag={gameStart}
                    gameTurn={gameTurn}
                    question={question}
                    participantsForTurnSet={participantsForTurn}
                    role={role}
                  />
                </>
              ) : (
                <>gameNumError</>
              )}
            </div>
          ) : (
            ""
          )}
          <div style={{ marginTop: "40px" }}>{content}</div>
        </Box>
      </Fade>
    </div>
  );
};
export default McBot;
