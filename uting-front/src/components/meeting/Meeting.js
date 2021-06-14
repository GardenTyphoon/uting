import defaultAxios from "../../utils/defaultAxios";
import React from "react";
import jwtAxios from "../../utils/jwtAxios";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import socketio from "socket.io-client";
import { useAppState } from "../../providers/AppStateProvider";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { createGetAttendeeCallback, fetchMeeting } from "../../utils/api";
import "./Meeting.css";
import baseurl from "../../utils/baseurl";
import introLogo from "../../img/../img/배경없는유팅로고.png"
import { SOCKET } from "../../utils/constants";
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
function birthToAge(birth) {
  let year = birth.slice(0, 4);
  return 2021 - Number(year) + 1;
}
function limitNumOfParticipants(inputTag, inputValue, numOfGroupMember) {
  if (inputTag === "num" && inputValue >= numOfGroupMember && inputValue <= 4)
    return true;
  else return false;
}
function contidionMakingRoom(toggleShowWarningMess, roomTitle, roomNum) {
  if (toggleShowWarningMess === false && roomTitle != "" && roomNum > 0)
    return true;
  else return false;
}

const Meeting = ({ checkFunc }) => {
  const history = useHistory();
  const meetingManager = useMeetingManager();
  const {
    setAppMeetingInfo,
    region: appRegion,
    meetingId: appMeetingId,
  } = useAppState();

  const [groupMembers, setGroupMembers] = useState([]);
  const [toggleShowWarningMess, setToggleShowWarningMess] = useState(false);
  const [roomtitle, setRoomtitle] = useState("");
  const [groupmemeinfo, setGroupmemeinfo] = useState({});
  //const [roomtitle,setRoomtitle]=useState("")
  let sessionUser = sessionStorage.getItem("nickname");
  let groupMembersSocketId = [];
  let groupMembersInfo = [];
  const [getalert, setGetalert] = useState({ flag: false, message: "" });
  //let roomtitle="";
  const [room, setRoom] = useState({
    title: "", //방제
    num: 0, //성별당 최대인원
    status: "대기", // 참가버튼 누르면 미팅중
    users: [],
  });

  const onChangehandler = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setRoom({
        ...room,
        [name]: value,
      });
    } else {
      if (
        limitNumOfParticipants(name, value, Object.keys(groupMembers).length)
      ) {
        setRoom({
          ...room,
          [name]: value,
        });
        setToggleShowWarningMess(false);
      } else {
        setToggleShowWarningMess(true);
      }
    }
  };
  const getMyGroupMember = async () => {
    
    let res = await defaultAxios.post("/groups/getMyGroupMember", {
      sessionUser: sessionUser,
    });
    let onlyMe = [sessionUser];
    if (res.data === "no") setGroupMembers(onlyMe);
    else setGroupMembers(res.data);
    //setGroupMembers(res);
  };
  useEffect(() => {
    getMyGroupMember();
  }, []);
  const makeRoom = async (e) => {
    e.preventDefault();
    const res = await jwtAxios.post("/meetings/check", { title: room });
  
    if (res.data === true) {
      setGetalert({ flag: true, message: "이미 존재하는 방 이름입니다." });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    } else if (res.data === false) {
      if (contidionMakingRoom(toggleShowWarningMess, room.title, room.num)) {
        //내가 속한 그룹의 그룹원들 닉네임 받아오기
        //평균 나이, 평균 학점, 현재 남녀 수 구하기
        let avgManner = 0;
        let avgAge = 0;
        let nowOfWoman = 0;
        let nowOfMan = 0;
        let hostImgURL="";
        for (let i = 0; i < groupMembers.length; i++) {
          
          let userInfo = await jwtAxios.post("/users/userInfo", {
            userId: groupMembers[i],
          });
          groupMembersInfo.push({
            nickname: userInfo.data.nickname,
            introduce: userInfo.data.introduce,
            mannerCredit: userInfo.data.mannerCredit,
            age: birthToAge(userInfo.data.birth),
            ucoin: userInfo.data.ucoin,
            gender: userInfo.data.gender,
            socketid: userInfo.data.socketid,
          });
          if (userInfo.data.nickname != sessionUser) {
            let data = {
              nickname: userInfo.data.nickname,
              socketid: userInfo.data.socketid,
            };
            setGroupmemeinfo(data);
            groupMembersSocketId.push(userInfo.data.socketid);
          }
          if(userInfo.data.nickname === sessionUser) {
            hostImgURL = userInfo.data.imgURL;
          }
          avgManner += userInfo.data.mannerCredit;
          avgAge += birthToAge(userInfo.data.birth);
          if (userInfo.data.gender === "woman") {
            nowOfWoman += 1;
          } else nowOfMan += 1;
        }
        let coinCheck = true;
        for (let i = 0; i < groupMembersInfo.length; i++) {
          if (groupMembersInfo[i].ucoin < 1) {
            coinCheck = false;
          }
        }
        if (coinCheck === true) {
          avgManner /= groupMembers.length;
          
          avgAge /= groupMembers.length;
          avgAge = parseInt(avgAge);

          const roomTitle = room.title.trim().toLocaleLowerCase();
         
          let data = {
            title: roomTitle,
            maxNum: Number(room.num),
            status: room.status,
            avgManner: avgManner.toFixed(3),
            avgAge: avgAge,
            numOfWoman: nowOfWoman,
            numOfMan: nowOfMan,
            session: sessionUser,
            flag: 0,
            hostImgURL:hostImgURL,
          };
          data.users = groupMembersInfo;

          meetingManager.getAttendee = createGetAttendeeCallback(roomTitle);

          checkFunc(true);

          try {
            const { JoinInfo } = await fetchMeeting(data);
            await meetingManager.join({
              meetingInfo: JoinInfo.Meeting,
              attendeeInfo: JoinInfo.Attendee,
            });

            setAppMeetingInfo(roomTitle, sessionUser, "ap-northeast-2");
            if (roomTitle !== undefined) {
              const socket = socketio.connect(SOCKET);
              socket.emit("makeMeetingRoomMsg", {
                groupMembersSocketId: groupMembersSocketId,
                roomtitle: roomTitle,
              });
            }

            await meetingManager.start();

            history.push(`/room/${roomTitle}`);
          } catch (error) {
          }
        } else if (coinCheck === false) {
          setGetalert({ flag: true, message: '그룹원 중에 유코인이 부족한 사람이 있어 방생성이 불가합니다.'
         });
          setTimeout(() => {
            setGetalert({ flag: false, message: "" });
          }, 1500);
        }
      }
    }
  };

  return (
    <div className="makeRoomContainer">
      <div>
        <div style={{ display: "flex", flexDirection: "row", margin: "20px" }}>
          <div style={{ marginRight: "15px" }}>미팅방 이름</div>
          <input
            className="room-input"
            type="text"
            placeholder="방제목"
            onChange={onChangehandler}
            name="title"
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "20px",
            marginTop: "0px",
          }}
        >
          <div style={{ marginRight: "15px" }}>성별당 명수</div>
          <input
            className="num-input"
            type="number"
            min="1"
            max="4"
            placeholder="명수"
            onChange={onChangehandler}
            name="num"
          />
        </div>
        {toggleShowWarningMess === true ? (
          <span className="warningMess">
            * 성별당 인원수는 {groupMembers.length}명 이상, 4명 이하여야 합니다.
          </span>
        ) : (
          ""
        )}
      </div>
      <button
        className="makeRoomBtn"
        onClick={makeRoom}
        style={{ marginTop: "2 0px" }}
      >
        방만들기
      </button>
      <Modal isOpen={getalert.flag}>
        <ModalHeader style={{ height: "70px", textAlign: "center" }}>
          <img
            style={{
              width: "40px",
              height: "40px",
              marginLeft: "210px",
              marginBottom: "1000px",
            }}
            src={introLogo}
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
export default Meeting;
