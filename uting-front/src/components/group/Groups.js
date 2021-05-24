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
import axios from "axios";
import AddMember from "./AddMember";
import "../../App.css";

import socketio from "socket.io-client";

const Member = styled.div`
  border: 1.5px solid rgb(221, 221, 221);
  border-radius: 7px;
  margin-bottom: 10px;
  width: 10vw;
  min-width:150px;
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
  min-width:150px;
  height: 50px;
  padding-top: 5%;
  padding-bottom: 1%;
  background-color: white;
  text-align:center;
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
  font-size: medium;
  color: #896e6e;
  margin-bottom: 5%;
`;

const Groups = ({ currentsocketId, checkGroup, checkAnother, groupSocket }) => {
  const [currentUser, setCurrentUser] = useState(
    sessionStorage.getItem("nickname")
  );
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [groupMember, setGroupMember] = useState([]);
  const [checkMem, setCheckMem] = useState(false);
  const [groupSocketIdList, setGroupSocketIdList] = useState([]);
  const [clickLeaveGroup, setClickLeaveGroup] = useState(false);

  let [modalStatus, setModalStatus] = useState(false);
  let sessionUser = sessionStorage.getItem("nickname");
  const getGroupInfo = async (e) => {
    let data = { sessionUser: sessionUser };
    const res = await axios.post(
      "http://localhost:3001/groups/info",
      data
    );
    console.log(res.data.member);
    setGroupMember(res.data.member);
  };

  const leaveGroup = async () => {
    const socket = socketio.connect("http://localhost:3001");
    setClickLeaveGroup(false)
     let groupMemberExceptMe = [];
     groupMember.map((mem)=>{if(mem!==sessionUser){groupMemberExceptMe.push(mem)}})
     console.log(groupMemberExceptMe);
     
     let res = await axios.post(
      "http://localhost:3001/users/preMemSocketid",
      {preMember:groupMemberExceptMe}
    );
    console.log(res.data);
    socket.emit("leaveGroup", { socketIdList: res.data, leavingUsers:sessionUser });
   
    res = await axios.post("http://localhost:3001/groups/leaveGroup", { userNickname: sessionUser });
   
    window.location.reload();
  }

  let saveGroupSocketId = async () => {
    let data = {
      preMember: groupMember,
    };
    const res = await axios.post(
      "http://localhost:3001/users/preMemSocketid",
      data
    );

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
      <Member>{currentUser}</Member>
      {groupMember === undefined
        ? ""
        : groupMember.map((data, member) => {
          if (data !== currentUser) {
            return <Member>{data}</Member>;
          }
        })}
      <PlusIcon onClick={toggelAddMember}>+</PlusIcon>
      {groupMember !== undefined ? <PlusIcon onClick={() => setClickLeaveGroup(true)}>그룹 나가기</PlusIcon> : ""}
      <Modal isOpen={clickLeaveGroup}>
        <ModalBody>
          그룹을 떠나시겠습니까?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={()=>setClickLeaveGroup(false)}>아니요</Button>{' '}
          <Button color="secondary" onClick={()=>leaveGroup()}>예</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={addMemberModal}>
        <ModalHeader
          toggle={toggelAddMember}
          style={{ fontFamily: "Jua", fontSize: "20px" }}
        >
          그룹 생성
        </ModalHeader>
        <AddMember
          currentsocketId={currentsocketId}
          prevMember={checkMem}
          checkMember={(e) => toggleCheckMem(e)}
          modalState={(e) => toggleModalStatus(e)}
          currentUser={currentUser}
          preMemSocketIdList={groupSocketIdList}
          groupMemList={groupMember}
        ></AddMember>
      </Modal>
    </GroupBox>
  );
};

export default Groups;
