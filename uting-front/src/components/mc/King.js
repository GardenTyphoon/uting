import React, { useState, useEffect, useContext, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledCarousel,
} from "reactstrap";
import socketio, { Socket } from "socket.io-client";

const items = [
  //for 설명서
  {
    src: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa1d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa1d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.3%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
    altText: "1. (차례인 유저)질문상대 선택하고 질문하기",
    caption: "질문 예시 : 이상형이 누구에요?? 여기서 마음에 드는 사람 있어요??",
    header: "1. 차례인 유저는 질문할 대상을 선택한다.",
  },
  {
    src: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
    altText: "2. 질문 응답",
    caption:
      "질문을 받은 유저는 질문에 해당하는 유저를 고르면 모든 유저에게 응답이 알려진다.",
    header: "2. 질문 응답",
  },
  {
    src: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
    altText:
      "3. 질문이 궁금한 사람은 술을 마시고 질문한 사람에게 질문을 물어 볼 수 있다.",
    caption:
      "질문이 궁금한 사람은 술을 마시고 질문한 사람에게 질문을 물어 볼 수 있다.",
    header: "3. 질문 알려주기",
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
  let currentUser = sessionStorage.getItem("nickname");

  var objRole = {};
  var data;

  function getRandomInt(min, max) {
    //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const determineRole = (member) => {
    var tmp = member.slice();
    var rand = getRandomInt(0, member.length);

    objRole[`${member[rand]}`] = "왕";
    tmp.splice(rand, 1);
    for (var i = 1; i < member.length; i++) {
      rand = getRandomInt(0, tmp.length);
      objRole[`${tmp[rand]}`] = `${i}`;
      tmp.splice(rand, 1);
    }
    console.log("왕게임 obj : ");
    console.log(objRole);
  };
  const start = () => {
    setStartButtonFade(false);
    determineRole(participants);
    setFlag(true);
  };

  const globalizeGameStart = () => {
    data = { gameName: "왕게임", socketIdList: participantsSocketIdList };
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("gameStart", data);
  };

  const globalizeRole = () => {
    const socket = socketio.connect("http://localhost:3001");
    socket.emit("notifyRole", {
      socketIdList: participantsSocketIdList,
      role: objRole,
    });
  };

  useEffect(async () => {
    if (flag) {
      globalizeGameStart();
      globalizeRole(); //+
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
      console.log("myRole : " + myRole);
      setGameRole(myRole);
    }
  }, [role]);

  const parsRole = (role) => {
    return Object.keys(role).find((key) => key === currentUser);
  };

  return (
    <>
      {startButtonFade ? (
        <Button outline color="secondary" style={{ border: 0 }} onClick={start}>
          왕게임시작
        </Button>
      ) : (
        <>
<<<<<<< Updated upstream
          <strong>왕게임</strong>
          <div
            style={{
              fontSize: "medium",
              marginTop: "10%",
              marginBottom: "10%",
            }}
          >
            무엇이든 다 할 수 있을 것만 같은 악마의 게임
          </div>
=======
>>>>>>> Stashed changes
          <Button
            outline
            color="secondary"
            style={{ border: 0 }}
            onClick={start}
          >
            왕게임시작
          </Button>
          {gameRole}
        </>
      )}
    </>
  );
};
export default King;
