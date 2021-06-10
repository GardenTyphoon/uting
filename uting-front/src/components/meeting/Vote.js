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
  Input,
  Alert,
} from "reactstrap";
import defaultAxios from "../../utils/defaultAxios";
import socketio from "socket.io-client";
import "./Vote.css";
import { ToastContainer, toast } from "react-toastify";
import { endMeeting } from "../../utils/api";
import introLog from "../../img/배경없는유팅로고.png";
const Vote = forwardRef(
  (
    { participantsSocketIdList, participants, meeting_id, meetingMembers },
    ref
  ) => {
    const history = useHistory();

    const [toggleEndMeetingBtn, setToggleEndMeetingBtn] = useState(false);
    const [toggleManner, setToggleManner] = useState(false);
    const [startVote, setStartVote] = useState(false);
    const [numOfAgree, setNumOfAgree] = useState(0);
    const [numOfDisagree, setNumOfDisagree] = useState(0);
    const [isVote, setIsVote] = useState(false);
    const [flag, setFlag] = useState(false);
    const [myDeicision, setMyDecision] = useState("");
    const [copyParticipants, setCopyParticipants] = useState(participants);
    const [goManner, setGoManner] = useState({ name: "", manner: "" });
    const [getalert, setGetalert] = useState({ flag: false, message: "" });

    let sessionUser = sessionStorage.getItem("nickname");
    let toggleAlert = (e) => {
      setGetalert({ ...getalert, flag: !getalert.flag });
    };

    useEffect(() => {
      setGetalert({ flag: false, message: "" });
    }, []);

    const onClickStartVoteBtn = async (e) => {
      setToggleEndMeetingBtn(!toggleEndMeetingBtn);
      setStartVote(true);
      setFlag(true);
    };

    const onClickAgree = (e) => {
      const socket = socketio.connect("http://localhost:3001");
      socket.emit("endMeetingAgree", {
        participantsSocketIdList,
        numOfAgree: numOfAgree + 1,
      });
      setNumOfAgree(numOfAgree + 1);
      setIsVote(!isVote);
      setMyDecision("찬성");
    };

    const onClickDisagree = (e) => {
      const socket = socketio.connect("http://localhost:3001");
      socket.emit("endMeetingDisagree", {
        participantsSocketIdList,
        numOfDisagree: numOfDisagree + 1,
      });
      setNumOfDisagree(numOfDisagree + 1);
      setIsVote(!isVote);
      setMyDecision("반대");
    };

    const emitStartVote = () => {
      const socket = socketio.connect("http://localhost:3001");
      socket.emit("startVote", { socketidList: participantsSocketIdList });
      console.log(participantsSocketIdList);
      console.log("emitvote");
    };

    useImperativeHandle(ref, () => ({
      onStartVote() {
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
      onClickEndMeetingBtn() {
        console.log(participantsSocketIdList);
        setToggleEndMeetingBtn(!toggleEndMeetingBtn);
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

    useEffect(() => {
      if (toggleManner === true) {
        //
        let arr = participants;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === sessionStorage.getItem("nickname")) {
            arr.splice(i, 1);
            i--;
          }
        }
        setCopyParticipants(arr);
      }
    }, [toggleManner]);

    useEffect(() => {
      if (doneVote()) {
        if (conditionEndMeeting()) {
          setTimeout(() => {
            toast("투표가 종료되었습니다. 미팅을 종료합니다.");
            setToggleManner(true);
          }, 1000);
        } else {
          setTimeout(() => {
            toast("투표가 종료되었습니다. 미팅을 계속합니다.");
            //여기수정
            setStartVote(false);
            setMyDecision("");
            setNumOfDisagree(0);
            setNumOfAgree(0);
            setIsVote(false);
            setFlag(false);
          }, 1000);
        }
      }
    }, [numOfAgree, numOfDisagree]);

    let onChangehandler = (e) => {
      let { name, value } = e.target;
      if (name === "par_name") {
        //value는 학점줄 닉네임
        setGoManner({ ...goManner, ["name"]: value });
      } else if (name === "realmanner") {
        setGoManner({ ...goManner, ["manner"]: Number(value) });
      }

      console.log(value);
    };

    let saveManner = async (e) => {
      let data = {
        name: goManner.name,
        manner: goManner.manner,
      };
      const res = await defaultAxios.post("/users/manner", data);
      console.log(res);
      if (res.data === "success") {
        let arr = copyParticipants;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === goManner.name) {
            arr.splice(i, 1);
            i--;
          }
        }
        //alert(`${goManner.name}`+"님에게 학점을 부여하였습니다.")
        setGetalert({
          flag: true,
          message: `${goManner.name}` + "님에게 학점을 부여하였습니다.",
        });
        document.getElementsByName("per_name").values = "default";
        document.getElementsByName("realmanner").values = "default";
        setCopyParticipants(arr);
        setGoManner({ name: "", manner: "" });
        setTimeout(() => {
          setGetalert({ flag: false, message: "" });
        }, 2000);
      }
    };

    let finishMeeting = async (e) => {
      //방 나갈때 numOfWoman이랑 numOfMan 중에 적절한거 -1하기 그리고 numOfWoman이랑 numOfMan이 각각 0이 되면 미팅방 del
      let ismember = false;
      let mem = {};
      for (let i = 0; i < meetingMembers.length; i++) {
        if (meetingMembers[i].nickname === sessionStorage.getItem("nickname")) {
          ismember = true;
          mem = meetingMembers[i];
        }
      }
      if (ismember === true) {
        let data = {
          title: meeting_id,
          user: mem.nickname,
          gender: mem.gender,
          session: sessionUser,
        };
        console.log(data);

        const res = await defaultAxios.post("/meetings/leavemember", data);

        if (res.data === "success") {
          setGetalert({ flag: true, message: "미팅 방을 나갑니다." });
          setTimeout(() => {
            setGetalert({ flag: false, message: "" });
            window.location.href = "http://localhost:3000/main";
          }, 1500);
        } else if (res.data === "last") {
          setGetalert({ flag: true, message: "미팅 방을 나갑니다." });
          setTimeout(async () => {
            await endMeeting(meeting_id);
            setGetalert({ flag: false, message: "" });
            window.location.href = "http://localhost:3000/main";
          }, 1500);
        }
      }
    };
    return (
      <div>
        <Modal isOpen={toggleEndMeetingBtn}>
          <ModalHeader>미팅 종료 투표</ModalHeader>
          <ModalBody className="meetingend">
            <span style={{ color: "red", fontWeight: "bold" }}>미팅 종료</span>
            를 위한 투표를 진행하시겠습니까?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(e) => onClickStartVoteBtn(e)}>
              투표하기
            </Button>{" "}
            <Button
              color="secondary"
              onClick={(e) => setToggleEndMeetingBtn(!toggleEndMeetingBtn)}
            >
              취소
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={toggleManner}>
          <ModalHeader>매너학점</ModalHeader>
          <ModalBody>
            <Input
              type="select"
              name="par_name"
              id="par_name"
              onChange={(e) => onChangehandler(e)}
            >
              <option value="default" selected>
                닉네임을 선택해주세요.
              </option>
              {copyParticipants.map((data, i) => {
                return <option value={data}>{data}</option>;
              })}
            </Input>
            {goManner !== "" ? (
              <span>
                <Input
                  id="realmanner"
                  type="select"
                  name="realmanner"
                  onChange={(e) => onChangehandler(e)}
                >
                  <option value="default" selected>
                    학점을 선택해주세요
                  </option>
                  <option value="4.5">A+</option>
                  <option value="4.0">A0</option>
                  <option value="3.5">B+</option>
                  <option value="3.0">B0</option>
                  <option value="2.5">C+</option>
                  <option value="2.0">C0</option>
                  <option value="1.5">D+</option>
                  <option value="1.0">D0</option>
                  <option value="0">F</option>
                </Input>
              </span>
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(e) => {
                saveManner(e);
              }}
            >
              학점부여
            </Button>{" "}
            <Button color="secondary" onClick={(e) => finishMeeting(e)}>
              끝내기
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={getalert.flag}>
          <ModalHeader style={{ height: "70px", textAlign: "center" }}>
            <img
              style={{
                width: "40px",
                height: "40px",
                marginLeft: "210px",
                marginBottom: "1000px",
              }}
              src={introLog}
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
                fontSize: "20px",
                height: "50px",
              }}
            >
              {getalert.message}
            </div>
          </ModalBody>
        </Modal>

        {startVote === true ? (
          <div className="voteContainer">
            <div>미팅을 종료하시겠습니까?</div>
            {isVote === false ? (
              <div>
                <button className="agreeBtn" onClick={(e) => onClickAgree(e)}>
                  찬성
                </button>
                <button
                  className="disAgreeBtn"
                  onClick={(e) => onClickDisagree(e)}
                >
                  반대
                </button>
              </div>
            ) : (
              <div>{myDeicision}하셨습니다.</div>
            )}
            <Progress multi>
              <Progress
                bar
                style={{ backgroundColor: "#2CDB52" }}
                value={numOfAgree}
                max={participants.length}
              />
              <Progress
                bar
                style={{ backgroundColor: "#FB6060" }}
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
  }
);
export default Vote;
