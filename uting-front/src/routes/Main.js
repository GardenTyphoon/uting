import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Profile from "../components/profile/Profile";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import Meeting from "../components/meeting/Meeting";
import MeetingList from "../components/meeting/MeetingList";
import Groups from "../components/group/Groups";
import "./Main.css";

const Main = () => {
  const history = useHistory();
  const [toggleMakeMeeting, setToggleMakeMeeting] = useState(false);
  const toggleMakeMeetingBtn = (e) => setToggleMakeMeeting(!toggleMakeMeeting);

  let sessionUser = sessionStorage.getItem("email");

  const gotoAdminPage = () => {
    history.push({
      pathname: `/admin`,
    });
  };
  return (
    <div className="mainContainer">
      <div className="Logo">
        <h5>메인</h5>
      </div>
      {sessionUser === "admin@ajou.ac.kr" ? (
        <button onClick={gotoAdminPage}>관리자페이지</button>
      ) : (
        ""
      )}
      <div className="main">
        <button
          onClick={(e) => {
            toggleMakeMeetingBtn(e);
          }}
          style={{ float: "right" }}
        >
          방만들기
        </button>
      </div>
      <Modal isOpen={toggleMakeMeeting}>
        <ModalBody isOpen={toggleMakeMeeting}>
          <Meeting />
        </ModalBody>
        <ModalFooter isOpen={toggleMakeMeeting}>
          <Button color="secondary" onClick={toggleMakeMeetingBtn}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Profile />
      <MeetingList />
      <Groups />
    </div>
  );
};

export default Main;
