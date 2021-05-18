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
  padding-left: 40%;
  padding-top: 5%;
  padding-bottom: 1%;
  background-color: white;
`;

const On = styled.span`
  background-color: rgb(70, 197, 70);
  border-radius: 100%;
  color: rgb(70, 197, 70);
  margin-left: 50px;
  float: rigth;
`;

const GroupBox = styled.div`
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
  let [modalStatus, setModalStatus] = useState(false);

  const getGroupInfo = async (e) => {
    let sessionUser = sessionStorage.getItem("nickname");
    let sessionObject = { sessionUser: sessionUser };
    const res = await axios.post(
      "http://localhost:3001/groups/info",
      sessionObject
    );
    setGroupMember(res.data.member);
  };

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
