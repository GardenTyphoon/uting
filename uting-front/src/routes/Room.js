import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router";
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'
import Vote from '../components/meeting/Vote'
import socketio from "socket.io-client";
import ReactAudioPlayer from 'react-audio-player';
import MeetingRoom from '../components/meeting/MeetingRoom';
import { useAppState } from '../providers/AppStateProvider';
//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

const Room = () => {
  const voteRef = useRef();
  const location = useLocation();
  const history = useHistory();
  

  const [socketFlag, setSocketFlag] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [participantsSocketId,setParticipantsSocketId]=useState([]);
  const [vote, setVote] = useState(false);
  const [participants,setParticipants] = useState([]);
  const [musicsrc,setMusicsrc]=useState("")
  

  const { meetingId } = useAppState();

  let putSocketid = async (e) => {
    let data = {
      currentUser: sessionStorage.getItem("nickname"),
      currentSocketId: socketId,
    };
    const res = await axios.post(
      "http://localhost:3001/users/savesocketid",
      data
    );
    setSocketFlag(!socketFlag)
  };

  useEffect(() => {
    
    putSocketid();
    console.log(socketId)
  }, [socketId]);

  let saveParticipantsSocketId = async()=>{
    let data={
      preMember:participants
    }
    const res = await axios.post("http://localhost:3001/users/preMemSocketid",data)

    
    if(res.data!=="undefined"){
      setParticipantsSocketId(res.data)
    }
  }


  const getparticipants = async () => {
    // const _id = location.state._id;
    // location.state를 쓰려면 순차적으로 넘어갈때만 가능
    // 다른 방법으로 props 없이 돌아가면 undefined가 됨.
    // 그래서 임시로 일단 AppStateProvider 값으로 지정함.
    const _id = meetingId;
    const res = await axios.post("http://localhost:3001/meetings/getparticipants", { _id: meetingId })
    console.log(" 참여자들 닉네임 : " + res.data);
   
    setParticipants(res.data);
  }

  useEffect(() => {
    const socket = socketio.connect("http://localhost:3001");
    socket.on("connect", function () {
      socket.emit("login", { uid: sessionStorage.getItem("nickname") });
    });

    socket.on("clientid", function async(id) {
      setSocketId(id);
    });

    socket.on("room",function(data){
      if(data.type==="startVote"){
        console.log("Room - startVote");
        voteRef.current.onStartVote();
      }
      else if(data.type==="endMeetingAgree"){
        if(voteRef.current!=null){
          console.log("Room - endMeetingAgree");
          voteRef.current.onEndMeetingAgree(data.numOfAgree);
          }
      }
      else if(data.type==="endMeetingDisagree"){
        if(voteRef.current!=null){
          console.log("Room - endMeetingDisagree");
          voteRef.current.onEndMeetingDisagree(data.numOfDisagree);
          }
      }
      else if(data.type==="musicplay"){
        //toast("호스트가 음악을 설정 하였습니다.");
        alert("호스트가 음악을 설정 하였습니다.")
        setMusicsrc(data.src)
      }

      else if(data.type==="musicpause"){
        //toast(data.message);
        alert(data.message)
        document.getElementById("audio").pause();
      }

      else if(data.type==="replay"){
        //toast(data.message)
        alert(data.message)
        document.getElementById("audio").play();
      }
    })

  return () => {
    socket.removeListener('room')
  }
  }, []);
  useEffect(()=>{
    setTimeout(()=>{
      getparticipants()
    },5000)
    
  },[socketFlag])
  

  useEffect(()=>{
    saveParticipantsSocketId()
  },[participants])


  return (
    <div style={{ backgroundColor: "#ffe4e1", width: "100vw", height: "100vh", padding: "2%" }}>
      
      <MeetingRoom />
      <ReactAudioPlayer id="audio" src={musicsrc}  controls/>
      <McBot participantsSocketIdList={participantsSocketId} currentSocketId={socketId} participants={participants}></McBot>
      <Vote ref={voteRef} participantsSocketIdList={participantsSocketId} participants={participants}></Vote>
      
    </div>
  );
};

export default Room;