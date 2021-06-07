import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router";
import styled from "styled-components";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Input,
} from "reactstrap";
import axios from "axios";
import McBot from "../components/mc/McBot";
import Vote from "../components/meeting/Vote";
import socketio from "socket.io-client";
import ReactAudioPlayer from "react-audio-player";
import MeetingRoom from "../components/meeting/MeetingRoom";
import { useAppState } from "../providers/AppStateProvider";
import { ToastContainer, toast } from "react-toastify";
import { endMeeting } from "../utils/api";
import MeetingControls from "../components/meeting/MeetingControls";
import "react-toastify/dist/ReactToastify.css";
import reportImg from "../img/report.png";
import help from "../img/help.png";
import airplane from "../img/airplane.png"
import McBotTutorial from "../components/mc/McBotTutorial";
import { backgroundColor } from "styled-system";
import "./Room.css"
import introLog from '../img/배경없는유팅로고.png'
const McBotContainer = styled.div`
  width: 350px;
  height: 550px;
  background: #fbbcb5;
  border-radius: 15px;
  text-align: center;
  padding: 20px;
  font-family: NanumSquare_acR;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Room = () => {
  const voteRef = useRef();
  const location = useLocation();
  const history = useHistory();

  const [socketFlag, setSocketFlag] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [participantsSocketId, setParticipantsSocketId] = useState([]);
  const [parObj,setParObj]=useState({})
  const [vote, setVote] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [musicsrc, setMusicsrc] = useState("");
  const [respondFlag, setRespondFlag] = useState(false);
  const [gameStartFlag, setGameStartFlag] = useState(false);
  const [gameEndFlag, setGameEndFlag] = useState(false);
  const [gameTurn, setGameTurn] = useState();
  const [question, setQuestion] = useState();
  const [participantsForTurn, setParticipantsForTurn] = useState();
  const [intervalMessage, setIntervalMessage] = useState("");
  const [intervalMessageCheck, setIntervalMessageChekc] = useState(0);
  const [intervalFade, setIntervalFade] = useState(0);
  const { meetingId } = useAppState();
  const [meeting_id, setMeeting_id] = useState("");
  const [meetingMembers, setMeetingMembers] = useState([]);
  const [toggleMidLeave, setToggleMidLeave] = useState(false);
  const [ready, setReady] = useState(false);
  const [toggleReport, setToggleReport] = useState(false);
  const [endMeetingBtn, setEndMeetingBtn] = useState(false);
  const [role, setRole] = useState();
  const [gameNum, setGameNum] = useState();
  const [toggleHelp, setToggleHelp] = useState(false);
  const [chimeinfo, setChimeinfo] = useState([]);
  const [maxNum, setmaxNum] = useState();
  const [getalert,setGetalert]=useState({"flag":false,"message":""})
  const [flagMessage,setFlagMessage]=useState(true);
  const [iloveyou,setIloveyou]=useState({"mylove":"","socketid":"","lovemessage":""})
  const [existMidleave,setExistMidleave]=useState(false);

  let toggleFlagMessage =()=>{
    setFlagMessage(!flagMessage)
  }
  
  let toggleAlert =(e)=>{
    setGetalert({...getalert,"flag":!getalert.flag})
  }

  let putSocketid = async (e) => {
    let data = {
      currentUser: sessionStorage.getItem("nickname"),
      currentSocketId: socketId,
    };
    console.log("socketId.id",socketId)
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
    let data = {
      preMember: participants,
    };
    const res = await axios.post(
      "http://localhost:3001/users/preMemSocketid",
      data
    );

    if (res.data.socketid !== "undefined") {
      setParObj(res.data)
      console.log(res.data)
      let arr=[]
      for(let i=0;i<res.data.length;i++){
        arr.push(res.data[i].socketid)
      }
      setParticipantsSocketId(arr);
      console.log(arr);
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
      const res = await axios.post(
        "http://localhost:3001/meetings/getparticipants",
        { _id: meetingId }
      );
      let par = [];
      for (let i = 0; i < (res.data.users).length; i++) {
        par.push(res.data.users[i].nickname);
        setChimeinfo()
      }
      console.log("이거", res.data.chime_info)
      setMeetingMembers(res.data.users);
      console.log(res.data)
      setMeeting_id(meetingId);
      setParticipants(par);
      setChimeinfo(res.data.chime_info);
      console.log(res.data.maxNum)
      setmaxNum(res.data.maxNum);
      setReady(true);
      setExistMidleave(false)
    }
  };

  useEffect(() => {
    let messageArr = [
      "대화 소재가 떨어졌을때 MC봇을 활용하는건 어떤가요?",
      "갑분싸가 됐나요? MC봇을 통해 게임을 추천받아보세요",
      "MC봇을 통해 미팅방에 음악을 재생시켜보세요 !",
      "이 기세를 몰아 MC봇을 통해 귓속말 게임을 해보세요 ~",
      "",
    ];
    //let index = Math.floor(Math.random() * messageArr.length);
    console.log(intervalMessageCheck);
   /* if (intervalMessageCheck < 4) {
      if (intervalMessageCheck === 0) {
        setTimeout(() => {
          setIntervalMessage(messageArr[0]);
          setIntervalMessageChekc(intervalMessageCheck + 1);
          setIntervalFade(2);
        }, 6000);
      } else if (intervalMessageCheck === 1) {
        setTimeout(() => {
          setIntervalMessage(messageArr[1]);
          setIntervalMessageChekc(intervalMessageCheck + 1);
          setIntervalFade(1);
        }, 6000);
      } else if (intervalMessageCheck === 2) {
        setTimeout(() => {
          setIntervalMessage(messageArr[2]);
          setIntervalMessageChekc(intervalMessageCheck + 1);
          setIntervalFade(3);
        }, 1200000);
      } else if (intervalMessageCheck === 3) {
        setTimeout(() => {
          setIntervalMessage(messageArr[3]);
          setIntervalMessageChekc(intervalMessageCheck + 1);
          setIntervalFade(4);
        }, 1200000);
      }
    }*/
  }, [intervalMessageCheck]);

  useEffect(() => {
    setGetalert({"flag":false,"message":""});
    const socket = socketio.connect("http://localhost:3001");
    socket.on("connect", function () {
      socket.emit("login", { uid: sessionStorage.getItem("nickname") });
    });

    socket.on("clientid", function async(id) {
      setSocketId(id);
    });

    socket.on("room", function (data) {
      if (data.type === "newParticipants") {
        setReady(false);
        toast("새로운 참여자가 들어옵니다!!");

        setTimeout(() => {
          getparticipants();
        }, 15000);
      } else if (data.type === "startVote") {
        toast("미팅 종료를 위한 투표를 시작합니다!ㅠoㅠ");
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
        setGameNum(data.gameNum);
      } else if (data.type === "endGame") {
        toast(data.message);
        setGameStartFlag(false);
        setGameNum(-1);
      } else if (data.type === "notifyRole") {
        toast(data.message);
        setRole(data.role);
      }
      else if(data.type==="golove"){
        toast(data.sender+"님이 - >"+data.message)
      }
      else if(data.type==="midleave"){
        toast(data.midleaveUser+"님이 퇴장하셨습니다.")
        setExistMidleave(true)
        getparticipants()
      }
    });
    return () => {
      socket.removeListener("room");
      socket.removeListener("clientid");
      socket.removeListener("connect");
    };
  }, []);

  useEffect(()=>{
    if(existMidleave===true){
      console.log("여깅")
      getparticipants();
    }
  },[existMidleave])

  useEffect(() => {
    if (socketFlag === true) {
      setTimeout(() => {
        getparticipants();
      }, 15000);
    }
  }, [socketFlag]);

  useEffect(() => {
    if (gameNum) {
      //console.log("gameNum Room.js start~!~! : " + gameNum);
    }
  }, [gameNum]);

  let cutUcoin = async (e) => {
    let data = {
      currentUser: e,
    };
    const res = await axios.post("http://localhost:3001/users/cutUcoin", data);
    console.log(res);
  };

  const midLeaveBtn = (e) => {
    setToggleMidLeave(!toggleMidLeave);
  };

  let midLeave = async (e) => {
    console.log("중도퇴장");
    // meeting 디비에 해당 사람 gender빼기, users object빼기
    // users 디비에 ucoin차감하기
    let ismember = false;
    let mem = {};
    console.log("meetingMembers",meetingMembers)
    for (let i = 0; i < meetingMembers.length; i++) {
      if (meetingMembers[i].nickname === sessionStorage.getItem("nickname")) {
        ismember = true;
        mem = meetingMembers[i];
      }
    }
    if (ismember === true) {
      let data = {
        title: meeting_id,
        user: mem.nickname,
        gender: mem.gender,
      };
      console.log(data);

      const res = await axios.post(
        "http://localhost:3001/meetings/leavemember",
        data
      );
      console.log(res);
      if (res.data === "success") {
        cutUcoin(sessionStorage.getItem("nickname"));
        setToggleMidLeave(false);
        //alert("미팅 방을 나갑니다.");
        for(let i=0;i<parObj.length;i++){
          if(parObj[i].nickname===sessionStorage.getItem("nickname")){
            parObj.splice(i, 1);
            i--;
          }
        }
        const socket = socketio.connect("http://localhost:3001");
        socket.emit("midleave", { memlist: parObj,midleaveUser:sessionStorage.getItem("nickname")});
        
        setGetalert({"flag":true,"message":"미팅 방을 나갑니다."});
        setTimeout(()=>{
          setGetalert({"flag":false,"message":""})
          window.location.href = "http://localhost:3000/main";
         },2000)
        
      }
      else if(res.data === "last"){
        setGetalert({"flag":true,"message":"미팅 방을 나갑니다."})
        setTimeout(async () => {
            await endMeeting(meeting_id);
            setGetalert({"flag":false,"message":""})
            window.location.href = "http://localhost:3000/main";
        }, 1500)

      }
      
    }
  };

  
  let onChangehandler=(e)=>{
    let { name, value } = e.target;
    console.log(parObj)
    if(name==="mylove")
    {
        for(let i=0;i<parObj.length;i++){
          if(parObj[i].nickname===value){
            setIloveyou({...iloveyou,["mylove"]:value,["socketid"]:parObj[i].socketid})
          }
        }
        //value는 학점줄 닉네임
    }
    else if(name==="lovemessage")
    {

      setIloveyou({...iloveyou,["lovemessage"]:value})

    }
    
}

let goLove =()=>{
    let data ={
      mylove:iloveyou.mylove,
      message:iloveyou.lovemessage,
      socketid:iloveyou.socketid,
      sender:sessionStorage.getItem("nickname")
    }
    toast(iloveyou.mylove+"님에게 정상적으로 메시지를 보냈습니다.")
    document.getElementsByName("loveinput").values="";
    document.getElementsByName("mylove").values="";
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("golove", { lovemessage: data});
  
}

useEffect(()=>{
  console.log(iloveyou)
},[iloveyou])
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
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "75%",
          height: "92vh",
          float: "left",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MeetingRoom info={chimeinfo} max={maxNum} />
        <div style={{ height: "20%" }}></div> {/* 이걸로 조정해뒀음 */}
        <MeetingControls participantss={participants} />
      </div>
      <div
        style={{
          width: "20%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Dropdown
          direction="down"
          isOpen={endMeetingBtn}
          toggle={() => {
            setEndMeetingBtn(!endMeetingBtn);
            endMeetingBtn === false
              ? setFlagMessage(false)
              : setFlagMessage(true);
          }}
        >
          <DropdownToggle
            caret
            style={{
              background: "#68D2FF",
              fontFamily: "NanumSquare_acR",
              border: "none",
              width: "120px",
              borderRadius: "20px",
              border: "0px",
              outline: "0px",
            }}
          >
            미팅 종료
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => voteRef.current.onClickEndMeetingBtn()}
            >
              미팅 종료 투표
            </DropdownItem>
            <DropdownItem onClick={() => midLeaveBtn()}>중도 퇴장</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Vote
          ref={voteRef}
          participantsSocketIdList={participantsSocketId}
          participants={participants}
          meeting_id={meeting_id}
          meetingMembers={meetingMembers}
        ></Vote>
        <div style={{ height: "10%" }}></div> {/* 이걸로 조정해뒀음 */}
        {flagMessage === true ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10%",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "NanumSquare_acR",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>To.</div>
              <select
                className="loveinput"
                name="mylove"
                style={{
                  width: "250px",
                  marginLeft: "10px",
                  marginRight: "50px",
                  border: "0",
                  backgroundColor: "rgb(255,228,225)",
                  borderBottom: "2px solid gray",
                }}
                onChange={(e) => onChangehandler(e)}
              >
                <option value="" selected>
                  받는 사람
                </option>
                {participants.map((data, i) => {
                  return data !== sessionStorage.getItem("nickname") ? (
                    <option value={data}>{data}</option>
                  ) : (
                    ""
                  );
                })}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "NanumSquare_acR",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px",
              }}
            >
              <input
                className="loveinput"
                placeholder="메시지를 입력해주세요."
                style={{
                  width: "260px",
                  marginLeft: "10%",
                  border: "0",
                  backgroundColor: "rgb(255,228,225)",
                  borderBottom: "2px solid gray",
                }}
                type="text"
                name="lovemessage"
                onChange={(e) => onChangehandler(e)}
              />
              <button
                style={{ border: "0", backgroundColor: "rgb(255,228,225)" }}
                onClick={(e) => goLove(e)}
              >
                <img src={airplane} style={{ width: "40px", height: "40px" }} />
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <McBotContainer>
          <button
            onClick={() => setToggleHelp(!toggleHelp)}
            style={{
              borderStyle: "none",
              background: "transparent",
              position: "relative",
              left: "43%",
            }}
          >
            <img src={help} width="25" />
          </button>

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
            intervalFade={intervalFade}
            role={role}
            gameNum_2={gameNum}
          ></McBot>
          <div>
            <ReactAudioPlayer
              style={{ width: "300px", marginTop: "20px" }}
              id="audio"
              src={musicsrc}
              controls
            />
          </div>
        </McBotContainer>
      </div>

      <Modal isOpen={!ready}>
        <ModalBody
          style={{
            textAlign: "center",
            fontFamily: " NanumSquare_acR",
            padding: "30px",
          }}
        >
          <Spinner color="dark" />
          <div style={{ margin: "20px", fontSize: "large" }}>
            잠시만 기다려주세요 o(*^▽^*)┛
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={toggleMidLeave}>
        <ModalHeader>중도 퇴장</ModalHeader>
        <ModalBody>
          <span style={{ color: "red", fontWeight: "bold" }}>중도 퇴장</span>을
          하시면 <span style={{ fontWeight: "bold" }}>U COIN이 1 차감</span>하게
          됩니다.
          <br />
          그래도 퇴장을 원하시면{" "}
          <span style={{ fontWeight: "bold" }}>나가기</span>를 눌러주세요.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => midLeave(e)}>
            나가기
          </Button>{" "}
          <Button color="secondary" onClick={(e) => midLeaveBtn(e)}>
            취소
          </Button>
        </ModalFooter>
      </Modal>

      <Modal size="lg" isOpen={toggleHelp}>
        <ModalHeader>mc봇 사용법</ModalHeader>
        <ModalBody>
          <McBotTutorial />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setToggleHelp()}>
            확인
          </Button>
        </ModalFooter>
      </Modal>

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
              fontSize: "18px",
              height: "50px",
            }}
          >
            {getalert.message}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Room;
