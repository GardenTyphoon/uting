import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "reactstrap";
import axios from "axios";
import socketio from "socket.io-client";

const Vote = forwardRef(({ participantsSocketIdList, participants }, ref) => {
  const history = useHistory();
  const socket = socketio.connect("http://localhost:3001");

  const [toggleEndMeetingBtn, setToggleEndMeetingBtn] = useState(false);
  const [startVote, setStartVote] = useState(false);
  const [numOfAgree, setNumOfAgree] = useState(0);
  const [numOfDisagree, setNumOfDisagree] = useState(0);
  const [isVote, setIsVote] = useState(false);
  const [flag, setFlag] = useState(false);
  const [myDeicision, setMyDecision] = useState("");

  const onClickEndMeetingBtn = (e) => {
    setToggleEndMeetingBtn(!toggleEndMeetingBtn);
  };

  const onClickStartVoteBtn = async (e) => {
    setToggleEndMeetingBtn(!toggleEndMeetingBtn);
    setStartVote(true);
    setFlag(true);
  };

  const onClickAgree = (e) => {
    socket.emit("endMeetingAgree", {
      participantsSocketIdList,
      numOfAgree: numOfAgree + 1,
    });
    setNumOfAgree(numOfAgree + 1);
    setIsVote(!isVote);
    setMyDecision("찬성");
  };

  const onClickDisagree = (e) => {
    socket.emit("endMeetingDisagree", {
      participantsSocketIdList,
      numOfDisagree: numOfDisagree + 1,
    });
    setNumOfDisagree(numOfDisagree + 1);
    setIsVote(!isVote);
    setMyDecision("반대");
  };

  const emitStartVote = () => {
    socket.emit("startVote", { socketidList: participantsSocketIdList });
    console.log(participantsSocketIdList);
    console.log("emitvote");
  };

  useImperativeHandle(ref, () => ({
    onStartVote() {
      alert("미팅 종료를 위한 투표를 시작합니다.");
      setStartVote(true);
    },
    onEndMeetingAgree(data) {
      if (startVote === true) {
        setNumOfAgree(data);
      }
    },
    onEndMeetingDisagree(data) {
      if (startVote === true) {
        setNumOfDisagree(data);
      }
    },
  }));

  function doneVote() {
    if (
      startVote === true &&
      numOfAgree + numOfDisagree === participants.length
    )
      return true;
    else return false;
  }

  function conditionEndMeeting() {
    if (numOfAgree > participants.length / 2) return true;
    else return false;
  }
  useEffect(() => {
    if (flag === true && startVote === true) {
      emitStartVote();
    }
  }, [flag]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (doneVote()) {
      if (conditionEndMeeting()) {
        setTimeout(() => {
          alert("투표가 종료되었습니다. 미팅을 종료합니다.");

          history.push({
            pathname: `/main`,
          });
        }, 1000);
      } else {
        setTimeout(() => {
          alert("투표가 종료되었습니다. 미팅을 계속합니다.");
          window.location.reload();
        }, 1000);
      }
    }
  }, [numOfAgree, numOfDisagree]);

  return (
    <div>
      <button onClick={(e) => onClickEndMeetingBtn(e)}>미팅 종료</button>
      <Modal isOpen={toggleEndMeetingBtn}>
        <ModalBody>
          미팅 종료 버튼을 누르셨습니다. 미팅 종료를 위한 투표를
          진행하시겠습니까?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => onClickStartVoteBtn(e)}>
            투표하기
          </Button>{" "}
          <Button color="secondary" onClick={(e) => onClickEndMeetingBtn(e)}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
      {startVote === true ? (
        <div style={{ backgroundColor: "#fffff0", borderRadius: "20px" }}>
          <div>미팅을 종료하시겠습니까?</div>
          {isVote === false ? (
            <div>
              <button onClick={(e) => onClickAgree(e)}>찬성</button>
              <button onClick={(e) => onClickDisagree(e)}>반대</button>
            </div>
          ) : (
            <div>{myDeicision}하셨습니다.</div>
          )}

          <Progress multi>
            <Progress
              bar
              color="success"
              value={numOfAgree}
              max={participants.length}
            />
            <Progress
              bar
              color="danger"
              value={numOfDisagree}
              max={participants.length}
            />
          </Progress>
        </div>
      ) : (
        ""
      )}
    </div>
  );
});
export default Vote;
