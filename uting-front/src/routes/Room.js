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
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from "reactstrap";
import axios from "axios";
import McBot from "../components/mc/McBot";
import Vote from "../components/meeting/Vote";
import socketio from "socket.io-client";
import ReactAudioPlayer from "react-audio-player";
import MeetingRoom from "../components/meeting/MeetingRoom";
import { useAppState } from "../providers/AppStateProvider";
import { ToastContainer, toast } from "react-toastify";
import { endMeeting } from '../utils/api'
import MeetingControls from '../components/meeting/MeetingControls';
import "react-toastify/dist/ReactToastify.css";
import reportImg from "../img/report.png"
import help from "../img/help.png"
import mcBotDescript1 from "../img/mcBotDescript1.png";
import { flexDirection, justifyContent } from "styled-system";
const McBotContainer = styled.div`
  width:250px;
  height:390px;
  background : #FBBCB5;
  border-radius:15px;
  text-align:center;
  padding:20px;
  padding-top:10px;
  font-family: NanumSquare_acR;
  
  display:flex;
  flex-Direction:column;
  align-items:center;
`;

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
  const [intervalMessage, setIntervalMessage] = useState("")
  const [intervalMessageCheck, setIntervalMessageChekc] = useState(0)
  const [intervalFade, setIntervalFade] = useState(0)
  const { meetingId } = useAppState();
  const [meeting_id, setMeeting_id] = useState("")
  const [meetingMembers, setMeetingMembers] = useState([])
  const [toggleMidLeave, setToggleMidLeave] = useState(false)
  const [ready, setReady] = useState(false);
  const [toggleReport, setToggleReport] = useState(false);
  const [endMeetingBtn, setEndMeetingBtn] = useState(false);
  const [toggleHelp, setToggleHelp] = useState(false);
  const items = [
    {
      src:{mcBotDescript1},
      altText: 'MC봇이란',
      caption: '원활한 미팅을 도와줄 UTING의 마스코트!'
    },
    {
      src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
      altText: '대화추천',
      caption: '어색한 분위기를 풀 수 있는 대화 소재를 추천해줘요!'
    },
    {
      src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
      altText: '게임추천',
      caption: '온라인 술자리에서 할 수 있는 게임을 추천해줘요!'
    },
    {
      src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
      altText: '실시간 게임',
      caption: '대면 미팅처럼 UTING에서 실시간으로 게임을 할 수 있어요!'
    },
    {
      src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
      altText: '음악 재생',
      caption: '다양한 분위기별 음악을 실시간으로 틀어줘요!'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} />
        <CarouselCaption captionText={item.caption} captionHeader={item.altText} />
      </CarouselItem>
    );
  });

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
    let data = {
      preMember: participants,
    };
    const res = await axios.post(
      "http://localhost:3001/users/preMemSocketid",
      data
    );

    if (res.data !== "undefined") {
      setParticipantsSocketId(res.data);
      console.log(res.data)
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
      console.log(" 참여자들 db정보 : ", res.data);
      console.log("길이", res.data.length);
      let par = [];
      for (let i = 0; i < res.data.length; i++) {
        par.push(res.data[i].nickname);
      }
      setMeetingMembers(res.data)
      console.log(par);
      setMeeting_id(meetingId)
      setParticipants(par);
      setReady(true);
    }
  };

  const submitReport = async () => {
    let reportNickname = document.getElementsByName("reportNickname");
    let reportContent = document.getElementsByName("reportContent");
    console.log(reportNickname[0].options[reportNickname[0].selectedIndex].value);
    console.log(reportContent[0].value)
    const res = await axios.post(
      "http://localhost:3001/reports/saveReport",
      {
        reportTarget: reportNickname[0].options[reportNickname[0].selectedIndex].value,
        reportContent: reportContent[0].value,
        reportRequester: sessionStorage.getItem("nickname"),
      }
    );
    console.log(res.data);
    alert(res.data)
  }


  useEffect(() => {
    let messageArr = ["대화 소재가 떨어졌을때 MC봇을 활용하는건 어떤가요?", "갑분싸가 됐나요? MC봇을 통해 게임을 추천받아보세요"
      , "MC봇을 통해 미팅방에 음악을 재생시켜보세요 !", "이 기세를 몰아 MC봇을 통해 귓속말 게임을 해보세요 ~", ""]
    //let index = Math.floor(Math.random() * messageArr.length);
    console.log(intervalMessageCheck)
    if (intervalMessageCheck < 4) {
      if (intervalMessageCheck === 0) {
        setTimeout(() => {
          setIntervalMessage(messageArr[0])
          setIntervalMessageChekc(intervalMessageCheck + 1)
          setIntervalFade(2)
        }, 600000)
      }
      else if (intervalMessageCheck === 1) {
        setTimeout(() => {
          setIntervalMessage(messageArr[1])
          setIntervalMessageChekc(intervalMessageCheck + 1)
          setIntervalFade(1)
        }, 1200000)
      }
      else if (intervalMessageCheck === 2) {
        setTimeout(() => {
          setIntervalMessage(messageArr[2])
          setIntervalMessageChekc(intervalMessageCheck + 1)
          setIntervalFade(3)
        }, 1200000)
      }
      else if (intervalMessageCheck === 3) {
        setTimeout(() => {
          setIntervalMessage(messageArr[3])
          setIntervalMessageChekc(intervalMessageCheck + 1)
          setIntervalFade(4)
        }, 1200000)
      }
    }


  }, [intervalMessageCheck])


  useEffect(() => {
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
        toast("새로운 참여자가 들어옵니다!!")

        setTimeout(() => {
          getparticipants();
        }, 15000);

      } else if (data.type === "startVote") {

        toast("미팅 종료를 위한 투표를 시작합니다!ㅠoㅠ")
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
      socket.removeListener('clientid')
      socket.removeListener('connect')
    };
  }, []);
  useEffect(() => {
    if (socketFlag === true) {

      setTimeout(() => {
        getparticipants();
      }, 15000);
    }
  }, [socketFlag]);

  let cutUcoin = async (e) => {
    let data = {
      currentUser: e,
    };
    const res = await axios.post("http://localhost:3001/users/cutUcoin", data);
    console.log(res);
  };

  const midLeaveBtn = (e) => {
    setToggleMidLeave(!toggleMidLeave)

  }

  let midLeave = async (e) => {
    console.log('중도퇴장')
    // meeting 디비에 해당 사람 gender빼기, users object빼기
    // users 디비에 ucoin차감하기
    let ismember = false
    let mem = {};
    for (let i = 0; i < meetingMembers.length; i++) {
      if (meetingMembers[i].nickname === sessionStorage.getItem("nickname")) {
        ismember = true
        mem = meetingMembers[i]
      }
    }
    if (ismember === true) {
      let data = {
        title: meeting_id,
        user: mem.nickname,
        gender: mem.gender
      }
      console.log(data)

      const res = await axios.post("http://localhost:3001/meetings/leavemember", data)
      console.log(res)
      if (res.data === "success") {
        cutUcoin(sessionStorage.getItem("nickname"))
        setToggleMidLeave(false)
        alert("미팅 방을 나갑니다.")
        window.location.href = "http://localhost:3000/main"

      }
    }
  }

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
        justifyContent: "space-between"
      }}
    >
      <div
        style={{
          width: "75%",
          height: "92vh",
          float: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>

        <MeetingRoom />
        <MeetingControls />
      </div>
      <div
        style={{
          width: "20%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly"
        }}>
        <div >
          <button onClick={() => setToggleReport(!toggleReport)} style={{ borderStyle: "none", background: "transparent", position:"relative", left:"90px", bottom:"10px"}}>
            <img src={reportImg} width="30" />
          </button>
         
        </div>
        <ReactAudioPlayer style={{ width: "250px" }} id="audio" src={musicsrc} controls />
        <McBotContainer>
        <button onClick={()=> setToggleHelp(!toggleHelp)} style={{ borderStyle: "none", background: "transparent", position:"relative", left:"90px"}} >
            <img src={help} width="25" />
          </button>
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
            intervalFade={intervalFade}
          ></McBot>
        </McBotContainer>

        <Vote
          ref={voteRef}
          participantsSocketIdList={participantsSocketId}
          participants={participants}
          meeting_id={meeting_id}
          meetingMembers={meetingMembers}

        ></Vote>

        <Dropdown direction="up" isOpen={endMeetingBtn} toggle={() => { setEndMeetingBtn(!endMeetingBtn) }}>
          <DropdownToggle caret style={{ background: "#68D2FF", fontFamily: "NanumSquare_acR", border: "none", width: "120px", borderRadius: "20px", border:"0px", outline:"0px" }}>
            미팅 종료
           </DropdownToggle>
          <DropdownMenu >
            <DropdownItem onClick={() => voteRef.current.onClickEndMeetingBtn()}>미팅 종료 투표</DropdownItem>
            <DropdownItem onClick={() => midLeaveBtn()}>중도 퇴장</DropdownItem>
          </DropdownMenu>
        </Dropdown>



      </div>
      <ToastContainer />

      <Modal isOpen={!ready}>
        <ModalBody style={{ textAlign: "center", fontFamily: " NanumSquare_acR", padding: "30px" }}>
          <Spinner color="dark" />
          <div style={{ margin: "20px", fontSize: "large" }}>잠시만 기다려주세요 o(*^▽^*)┛</div>
        </ModalBody>
      </Modal>

      <Modal isOpen={toggleMidLeave}>
        <ModalHeader>
          중도 퇴장
                </ModalHeader>
        <ModalBody>
          중도 퇴장을 하시면 U COIN이 1 차감하게 됩니다.
          그래도 퇴장을 원하시면 나가기를 눌러주세요.
                </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => midLeave(e)}></Button>{' '}
          <Button color="secondary" onClick={(e) => midLeaveBtn(e)}>취소</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={toggleReport}>
        <ModalHeader>사용자 신고</ModalHeader>
        <ModalBody>


          <select name="reportNickname">
            <option value="default" selected>신고 할 닉네임을 선택해주세요.</option>
            {participants.map((mem) => {
              if (mem != sessionStorage.getItem("nickname")) {

                return <option value={mem}>{mem}</option>
              }
            })}
          </select>
          <textarea name="reportContent" placeholder="신고 사유를 적어주세요."></textarea>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => submitReport()}>신고하기</Button>{' '}
          <Button color="secondary" onClick={() => setToggleReport(!toggleReport)}>취소</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={toggleHelp}>
        <ModalHeader>mc봇 사용법</ModalHeader>
        <ModalBody>
          <Carousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
          </Carousel>
        </ModalBody>
        <ModalFooter>
        <Button color="primary" onClick={() => setToggleHelp()}>확인</Button>
        </ModalFooter>
      </Modal>


    </div>
  );
};

export default Room;
