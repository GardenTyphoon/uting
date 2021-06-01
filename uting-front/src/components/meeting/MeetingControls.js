import React, { useEffect, useState, useRef } from "react";
import {
  ControlBar,
  AudioInputControl,
  VideoInputControl,
  ContentShareControl,
  AudioOutputControl,
  ControlBarButton,
  Dots,
} from 'amazon-chime-sdk-component-library-react';
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
import EndMeetingControl from './EndMeetingControl';
import { useNavigation } from '../../providers/NavigationProvider';
import axios from "axios";
import reportImg from "../../img/report.png";
import introLog from '../../img/배경없는유팅로고.png'
const MeetingControls = ({participantss}) => {
  const { toggleNavbar, closeRoster, showRoster } = useNavigation();
  const [toggleReport, setToggleReport] = useState(false);
  const [getalert,setGetalert]=useState({"flag":false,"message":""})
  
  let toggleAlert =(e)=>{
    setGetalert({...getalert,"flag":!getalert.flag})
  }

  useEffect(()=>{
    setGetalert({"flag":false,"message":""})
  },[])

  const handleToggle = () => {
    if (showRoster) {
      closeRoster();
    }

    toggleNavbar();
  };
  
  const submitReport = async () => {
    let reportNickname = document.getElementsByName("reportNickname");
    let reportContent = document.getElementsByName("reportContent");
    const res = await axios.post("http://localhost:3001/reports/saveReport", {
      reportTarget:
        reportNickname[0].options[reportNickname[0].selectedIndex].value,
      reportContent: reportContent[0].value,
      reportRequester: sessionStorage.getItem("nickname"),
    });
    console.log(res.data);
    //alert(res.data);
    setGetalert({"flag":true,"message":res.data})
    setTimeout(()=>{
      setToggleReport(!toggleReport)
    },1000)
    
  };

  return (
      <ControlBar
        className="controls-menu"
        layout="undocked-horizontal"
        showLabels
        style={{width:"100%"}}
      >
        <div style={{width:"55%"}}></div> {/* 이걸로 조정해뒀음 */}
        <AudioInputControl />
        <VideoInputControl />
        <AudioOutputControl />
        <div         
        style={{
          width: "50%",
          float: "left",
          display: "flex",
          justifyContent: "flex-end"
        }}>
        <button
          onClick={() => setToggleReport(!toggleReport)}
          style={{
            borderStyle: "none",
            background: "transparent",
          }}
        >
          <img src={reportImg} width="30" />
          &nbsp;&nbsp;&nbsp;
        </button>
        </div>
        <Modal isOpen={toggleReport}>
        <ModalHeader>사용자 신고</ModalHeader>
        
        <ModalBody>
          <div>
          <Input type="select"  name="reportNickname">
            <option value="default" selected>
              신고 할 닉네임을 선택해주세요.
            </option>
            {participantss.map((mem) => {
              if (mem != sessionStorage.getItem("nickname")) {
                return <option value={mem}>{mem}</option>;
              }
            })}
          </Input>
          </div>
          <div>
          <textarea style={{width:"465px",marginTop:"2%",height:"150px"}}
            name="reportContent"
            placeholder="신고 사유를 적어주세요."
          ></textarea></div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => submitReport()}>
            신고하기
          </Button>{" "}
          <Button
            color="secondary"
            onClick={() => setToggleReport(!toggleReport)}
          >
            취소
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={getalert.flag} >
        <ModalHeader style={{height:"70px",textAlign:"center"}}>
          <img style={{width:"40px",height:"40px",marginLeft:"210px",marginBottom:"1000px"}} src={introLog}></img>
        </ModalHeader>
        <ModalBody style={{height:"90px"}}>
          <div style={{textAlign:"center",marginTop:"4%",marginBottom:"8%",fontFamily:"NanumSquare_acR",fontWeight:"bold",fontSize:"20px",height:"50px"}}>{getalert.message}</div>
          
        </ModalBody>
      </Modal>
      </ControlBar>
  );
};

export default MeetingControls;