import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router";
import styled from "styled-components";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  FormText,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import axios from "axios";
import McBot from "../components/mc/McBot";
import Vote from "../components/meeting/Vote";
import socketio from "socket.io-client";
import ReactAudioPlayer from "react-audio-player";
import MeetingRoom from "../components/meeting/MeetingRoom";
import { useAppState } from "../providers/AppStateProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Room = () => {
  const voteRef = useRef();
  const location = useLocation();
  const history = useHistory();

  const [socketFlag, setSocketFlag] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [participantsSocketId, setParticipantsSocketId] = useState([]);
  const [vote, setVote] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [musicsrc, setMusicsrc] = useState("");
  const [respondFlag, setRespondFlag] = useState(false);
  const [gameStartFlag, setGameStartFlag] = useState(false);
  const [gameEndFlag, setGameEndFlag] = useState(false);
  const [gameTurn, setGameTurn] = useState();
  const [question, setQuestion] = useState();
  const [participantsForTurn, setParticipantsForTurn] = useState();
  const [intervalMessage,setIntervalMessage]=useState("")
  const [intervalMessageCheck,setIntervalMessageChekc]=useState(false)
  const { meetingId } = useAppState();

  let putSocketid = async (e) => {
    let data = {
      currentUser: sessionStorage.getItem("nickname"),
      currentSocketId: socketId,
    };
    //console.log("socketId.id",socketId)
    const res = await axios.post(
      "http://localhost:3001/users/savesocketid",
      data
    );
    //console.log(res)
    setSocketFlag(true);
  };

  useEffect(() => {
    putSocketid();
    console.log(socketId);
  }, [socketId]);

  let saveParticipantsSocketId = async () => {
    console.log("saveParticipantsSocketId");
    let data = {
      preMember: participants,
    };
    const res = await axios.post(
      "http://localhost:3001/users/preMemSocketid",
      data
    );

    if (res.data !== "undefined") {
      setParticipantsSocketId(res.data);
    }
  };
  useEffect(() => {
    if (participantsSocketId.length !== 0) {
      cutUcoin(sessionStorage.getItem("nickname"));
    }
  }, [participantsSocketId]);

  const getparticipants = async () => {
    //const _id = location.state._id;
    // location.state를 쓰려면 순차적으로 넘어갈때만 가능
    // 다른 방법으로 props 없이 돌아가면 undefined가 됨.
    // 그래서 임시로 일단 AppStateProvider 값으로 지정함.

    const _id = meetingId;
    if (meetingId !== "") {
      console.log("meetingId", meetingId);
      const res = await axios.post(
        "http://localhost:3001/meetings/getparticipants",
        { _id: meetingId }
      );
      console.log(" 참여자들 닉네임 : " + res.data);
      console.log("길이", res.data.length);
      let par = [];
      for (let i = 0; i < res.data.length; i++) {
        par.push(res.data[i].nickname);
      }
      console.log(par);

      setParticipants(par);
    }
  };



  useEffect(()=>{
    let messageArr=["대화 소재가 떨어졌을때 MC봇을 활용하는건 어떤가요?","갑분싸가 됐나요? MC봇을 통해 게임을 추천받아보세요",
    "이 기세를 몰아 MC봇을 통해 귓속말 게임을 해보세요 ~","MC봇을 통해 미팅방에 음악을 재생시켜보세요 !","몰랑몰랑몰랑"]
    let index = Math.floor(Math.random() * messageArr.length);
    console.log(index)
    setTimeout(()=>{
      setIntervalMessage(messageArr[index])
      setIntervalMessageChekc(!intervalMessageCheck)

    },100000)
  },[intervalMessageCheck])


  useEffect(() => {
    const socket = socketio.connect("http://localhost:3001");
    socket.on("connect", function () {
      socket.emit("login", { uid: sessionStorage.getItem("nickname") });
    });

    socket.on("clientid", function async(id) {
      setSocketId(id);
    });

    socket.on("room", function (data) {
      if (data.type === "startVote") {
        console.log("Room - startVote");
        voteRef.current.onStartVote();
      } else if (data.type === "endMeetingAgree") {
        if (voteRef.current != null) {
          console.log("Room - endMeetingAgree");
          voteRef.current.onEndMeetingAgree(data.numOfAgree);
        }
      } else if (data.type === "endMeetingDisagree") {
        if (voteRef.current != null) {
          console.log("Room - endMeetingDisagree");
          voteRef.current.onEndMeetingDisagree(data.numOfDisagree);
        }
      } else if (data.type === "musicplay") {
        toast("호스트가 음악을 설정 하였습니다.");
        setMusicsrc(data.src);
      } else if (data.type === "musicpause") {
        toast(data.message);
        document.getElementById("audio").pause();
      } else if (data.type === "replay") {
        toast(data.message);
        document.getElementById("audio").play();
      } else if (data.type === "notifyTurn") {
        toast(`${data.turn}님의 차례입니다!`);
        setGameTurn(data.turn);
        setParticipantsForTurn(data.remainParticipants);
      } else if (data.type === "receiveMsg") {
        console.log("receiveMsg!!!");
        toast(`${data.mesg}`);
      } else if (data.type === "receiveQues") {
        console.log("receiveQues!!!");
        toast(`${data.mesg}`);
        setRespondFlag(true);
        setQuestion(data.mesg);
      } else if (data.type === "gameStart") {
        toast(data.message);
        setGameStartFlag(true);
        setGameEndFlag(false);
      } else if (data.type === "endGame") {
        toast(data.message);
        setGameStartFlag(false);
        //setGameEndFlag(true);
      }
    });
    return () => {
      socket.removeListener("room");
    };

    
  }, []);
  useEffect(() => {
    if (socketFlag === true) {
      setTimeout(() => {
        getparticipants();
      }, 5000);
    }
  }, [socketFlag]);

  let cutUcoin = async (e) => {
    let data = {
      currentUser: e,
    };
    const res = await axios.post("http://localhost:3001/users/cutUcoin", data);
    console.log(res);
  };

  useEffect(() => {
    saveParticipantsSocketId();
  }, [participants]);

  return (
    <div
      style={{
        backgroundColor: "#ffe4e1",
        width: "100vw",
        height: "100vh",
        padding: "2%",
      }}
    >
      <MeetingRoom />
      <ReactAudioPlayer id="audio" src={musicsrc} controls />
      {intervalMessage}
      <McBot
        participantsSocketIdList={participantsSocketId}
        currentSocketId={socketId}
        participants={participants}
        respondFlag={respondFlag}
        gameStartFlag={gameStartFlag}
        gameEndFlag={gameEndFlag}
        gameTurn={gameTurn}
        question={question}
        participantsForTurn={participantsForTurn}
      ></McBot>
      
      <Vote
        ref={voteRef}
        participantsSocketIdList={participantsSocketId}
        participants={participants}
      ></Vote>
      <ToastContainer />
    </div>
  );
};

export default Room;
