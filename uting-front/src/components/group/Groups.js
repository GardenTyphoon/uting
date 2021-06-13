import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Form,
  FormGroup,
  Label,
  FormText,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import defaultAxios from "../../utils/defaultAxios";
import jwtAxios from "../../utils/jwtAxios";
import AddMember from "./AddMember";
import "../../App.css";
import AnotherProfile from "../profile/MyProfile";

import baseurl from "../../utils/baseurl";
import socketio from "socket.io-client";
import { ConsoleLogger } from "amazon-chime-sdk-js";
import { SOCKET } from "../../utils/constants";

const Member = styled.div`
  border: 1.5px solid rgb(221, 221, 221);
  border-radius: 7px;
  margin-bottom: 10px;
  width: 10vw;
  min-width: 150px;
  height: 50px;
  text-align: center;
  padding-top: 5%;
  background-color: white;
`;

const PlusIcon = styled.div`
  border: 1.5px solid rgb(221, 221, 221);
  border-radius: 7px;
  margin-bottom: 10px;
  width: 10vw;
  min-width: 150px;
  height: 50px;
  padding-top: 5%;
  padding-bottom: 1%;
  background-color: white;
  text-align: center;
`;

const On = styled.span`
  background-color: rgb(70, 197, 70);
  border-radius: 100%;
  color: rgb(70, 197, 70);
  margin-left: 50px;
  float: rigth;
`;

const GroupBox = styled.div`
  font-family: NanumSquare_acR;
  float: right;
  background-color: #ffe4e1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GroupTitle = styled.div`
  font-family: NanumSquare_acR;
  font-weight: bold;
  font-size: medium;
  color: #896e6e;
  margin-top: 3%;
  margin-bottom: 8%;
`;

const Groups = ({
  currentsocketId,
  checkGroup,
  checkAnother,
  groupSocket,
  modifyNickname,
}) => {
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [groupMember, setGroupMember] = useState([]);
  const [checkMem, setCheckMem] = useState(false);
  const [groupSocketIdList, setGroupSocketIdList] = useState([]);
  const [clickLeaveGroup, setClickLeaveGroup] = useState(false);
  const [toggleOtherProfile, setToggleOtherProfile] = useState(false);
  const [anotherName, setAnotherName] = useState("");
  const [sessionUser, setSessionUser] = useState(
    sessionStorage.getItem("nickname")
  );
  const [modalStatus, setModalStatus] = useState(false);
  //let sessionUser = sessionStorage.getItem("nickname");

  const showProfile = (data) => {
   
    setToggleOtherProfile(true);
    setAnotherName(data);
  };
  const getGroupInfo = async (e) => {
    let data = { sessionUser: sessionStorage.getItem("nickname") };
    const res = await defaultAxios.post("/groups/info", data);
    setGroupMember(res.data.member);
  };

  useEffect(() => {
    if (modifyNickname === "success") {
      getGroupInfo();
    }
  }, [modifyNickname]);

  const leaveGroup = async () => {
    const socket = socketio.connect(SOCKET);
    setClickLeaveGroup(false);
    let groupMemberExceptMe = [];
    groupMember.map((mem) => {
      if (mem !== sessionUser) {
        groupMemberExceptMe.push(mem);
      }
    });
    console.log(groupMemberExceptMe)
    let res = await jwtAxios.post(`/users/preMemSocketid`, {
      preMember: groupMemberExceptMe,
    });
    console.log(res);
    let socketList=[]
    for(let i=0;i<res.data.length;i++){
      socketList.push(res.data[i].socketid)
    }
    socket.emit("leaveGroup", {
      socketIdList: socketList,
      leavingUsers: sessionUser,
    });

    res = await jwtAxios.post(`/groups/leaveGroup`, {
      userNickname: sessionUser,
    });

    getGroupInfo();
  };

  let saveGroupSocketId = async () => {
    let data = {
      preMember: groupMember,
    };
    const res = await defaultAxios.post("/users/preMemSocketid", data);

    if (res.data !== "undefined") {
      setGroupSocketIdList(res.data);
      groupSocket(res.data);
    }
  };

  const toggelAddMember = (e) => {
    setAddMemberModal(!addMemberModal);
  };

  let toggleModalStatus = (e) => {
    setModalStatus(e);
    if (e === true) {
      setAddMemberModal(false);
    }
  };

  let toggleCheckMem = (e) => {
    setCheckMem(e);
  };

  useEffect(() => {
    getGroupInfo();
  }, []);

  useEffect(() => {
    saveGroupSocketId();
  }, [groupMember]);

  useEffect(() => {
    if (checkGroup !== false) {
      getGroupInfo();
    }
  }, [checkGroup]);

  useEffect(() => {
    if (checkAnother !== false) {
      getGroupInfo();
    }
  }, [checkAnother]);

  useEffect(() => {
    getGroupInfo();
  }, [checkMem]);

  return (
    <GroupBox>
      <GroupTitle>Group Member</GroupTitle>
      <Member>{sessionStorage.getItem("nickname")}</Member>
      {groupMember === undefined
        ? ""
        : groupMember.map((data, member) => {
            if (data !== sessionStorage.getItem("nickname")) {
              return (
                <button
                  style={{ border: "0px", background: "transparent" }}
                  onClick={(e) => showProfile(data)}
                >
                  <Member>{data}</Member>
                </button>
              );
            }
          })}
      <button style={{ border: "0px", background: "transparent" }}>
        <PlusIcon onClick={toggelAddMember}>+</PlusIcon>
      </button>
      {groupMember !== undefined ? (
        <button style={{ border: "0px", background: "transparent" }}>
          <PlusIcon onClick={() => setClickLeaveGroup(true)}>
            그룹 나가기
          </PlusIcon>{" "}
        </button>
      ) : (
        ""
      )}
      <Modal isOpen={clickLeaveGroup}>
        <ModalHeader style={{fontFamily:"NanumSquare_acR"}}>
          그룹 퇴장
        </ModalHeader>
        <ModalBody style={{fontFamily:"NanumSquare_acR", textAlign:"center"}}>그룹을 떠나시겠습니까?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => leaveGroup()}>
            예
          </Button>{" "}
          <Button color="secondary" onClick={() => setClickLeaveGroup(false)}>
            아니요
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={addMemberModal}>
        <ModalHeader
          toggle={toggelAddMember}
          style={{ fontFamily: "NanumSquare_acR", fontSize: "20px" }}
        >
          그룹 생성
        </ModalHeader>
        <AddMember
          currentsocketId={currentsocketId}
          prevMember={checkMem}
          checkMember={(e) => toggleCheckMem(e)}
          modalState={(e) => toggleModalStatus(e)}
          currentUser={sessionStorage.getItem("nickname")}
          preMemSocketIdList={groupSocketIdList}
          groupMemList={groupMember}
        ></AddMember>
      </Modal>
      <Modal
        isOpen={toggleOtherProfile}
        toggle={() => setToggleOtherProfile(!toggleOtherProfile)}
      >
        <ModalBody style={{ background: "#FFB4AC" }}>
          <button
            onClick={(e) => {
              setToggleOtherProfile(false);
            }}
            style={{
              background: "transparent",
              border: "none",
              position: "absolute",
              left: "90%",
            }}
          >
            X
          </button>
          <AnotherProfile choicename={anotherName} />
        </ModalBody>
      </Modal>
    </GroupBox>
  );
};

export default Groups;
