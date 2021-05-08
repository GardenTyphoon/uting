import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import woman from "../../img/woman.png";
import man from "../../img/man.png";
import MeetingRoom from "../../img/MeetingRoom.png";
import "./MeetingList.css";
import { Container, Row, Col } from "reactstrap";
import socketio from "socket.io-client";
let mannerColor;
function mannerCredit(avgManner) {
  if (avgManner === 4.5) {
    mannerColor = "#FF0000";
    return "A+";
  } else if (avgManner < 4.5 && avgManner >= 4.0) {
    mannerColor = "#FC92A4";
    return "A0";
  } else if (avgManner < 4.0 && avgManner >= 3.5) {
    mannerColor = "#FE5E16";
    return "B+";
  } else if (avgManner < 3.5 && avgManner >= 3.0) {
    mannerColor = "#FE9D72";
    return "B0";
  } else if (avgManner < 3.0 && avgManner >= 2.5) {
    mannerColor = "#97A1FF";
    return "C+";
  } else if (avgManner < 2.5 && avgManner >= 2.0) {
    mannerColor = "#020DEC";
    return "C0";
  } else if (avgManner < 2.0 && avgManner >= 1.5) {
    mannerColor = "#767171";
    return "D+";
  } else if (avgManner < 1.5 && avgManner >= 1.0) {
    mannerColor = "#151515";
    return "D0";
  } else {
    mannerColor = "#000000";
    return "F";
  }
}
export default function MeetingList({
  checkState,
  groupSocketList,
  currentsocketId,
}) {
  const history = useHistory();
  const [viewRoomList, setView] = useState([]);
  const [state, setState] = useState(false);
  const [title, setTitle] = useState("");

  const [groupMember, setGroupMember] = useState([]);
  const [flag, setFlag] = useState(false);
  const [roomObj, setRoomObj] = useState({});
  const socket = socketio.connect("http://localhost:3001");
  //randomroomid에는 참가하는 방 별로 값 가져와서 변수값으로 넣으면 됨
  const attendRoomByID = async (room) => {
    getGroupInfo();
    setRoomObj(room);
    setFlag(true);
    //현재 그룹원 모두에게 방 타이틀로 이동하는 메시지 띄우고 리다이렉트시키기
  };

  let saveMeetingUsers = async (e) => {
    let data = {
      member: groupMember,
      room: roomObj,
    };
    const res = await axios.post(
      "http://localhost:3001/meetings/savemember",
      data
    );
    console.log(res);
  };

  useEffect(() => {
    saveMeetingUsers();
  }, [groupMember]);
  useEffect(() => {
    groupSocketList.push(currentsocketId.id);

    socket.on("connect", function () {
      socket.emit("entermessage", {
        socketidList: groupSocketList,
        roomid: "roomid~!",
        _id: roomObj._id,
      });
      //socket.emit('hostentermessage',{"socketid":currentsocketId.id})
    });
  }, [flag]);

  const getGroupInfo = async (e) => {
    let sessionUser = sessionStorage.getItem("nickname");
    let sessionObject = { sessionUser: sessionUser };
    const res = await axios.post(
      "http://localhost:3001/groups/info",
      sessionObject
    );
    setGroupMember(res.data.member);
  };

  const toggleParticipantsInfo = (title) => {
    if (state === true) {
      setState(false);
      setTitle("");
    } else {
      setState(true);
      setTitle(title);
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/meetings")
      .then(({ data }) => setView(data))
      .catch((err) => {});
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/meetings")
      .then(({ data }) => setView(data))
      .catch((err) => {});
  }, [checkState]);

  return (
    //tr map 한다음에 key넣어주기
    <div style={{ width: "60%" }}>
      {viewRoomList.map((room, index) => (
        <div>
          <Container className="MeetingRoom">
            <Row style={{ width: "100%" }}>
              <img
                src={MeetingRoom}
                style={{
                  padding: "1%",
                  width: "10%",
                  borderRadius: "50%",
                  marginRight: "5%",
                }}
                onMouseOver={(e) => toggleParticipantsInfo(room.title)}
                onMouseOut={(e) => toggleParticipantsInfo(room.title)}
              />

              <Col xs="5" style={{ display: "flex", alignItems: "center" }}>
                {room.title}
              </Col>
              <Col xs="2">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: mannerColor,
                    marginTop: "15%",
                  }}
                >
                  <div style={{ marginRight: "7%" }}>{room.avgManner}</div>
                  <div>{mannerCredit(room.avgManner)}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#9A7D7D",
                    fontSize: "small",
                  }}
                >
                  {room.avgAge}살
                </div>
              </Col>
              <Col xs="3">
                <button
                  className="joinBtn"
                  onClick={() => attendRoomByID(room)}
                >
                  참가
                </button>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{ width: "10%", height: "15%", marginRight: "8%" }}
                    src={woman}
                  />
                  <img
                    style={{ width: "13%", height: "22%", marginRight: "8%" }}
                    src={man}
                  />
                  <div>
                    {" "}
                    {room.numOfWoman} | {room.numOfMan}{" "}
                  </div>
                </Col>
              </Col>
            </Row>
          </Container>
          {title === room.title && state === true ? (
            <div>
              {room.users.map((user) => (
                <div>
                  {user.nickname}
                  {user.introduce}

                  {user.mannerCredit}

                  {user.age}
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
}
