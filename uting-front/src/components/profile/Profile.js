import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import axios from "axios";
import MyProfile from "./MyProfile";
import ProfileNoImage from "../../img/ProfileNoImage.jpg";
import ucoin from "../../img/ucoin.png"
import {
  Button,
  CardBody,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from "reactstrap";

const Profile = () => {
  const history = useHistory();
  const [imgBase64, setImgBase64] = useState("");
  const [ProfileInfo, setProfileInfo] = useState({
    nickname: "",
    imgURL: "",
    mannerCredit: "",
    ucoin: "",
  });
  const [toggleprofile, setToggleProfile] = useState(false);
  const toggleProfileBtn = (e) => setToggleProfile(!toggleprofile);

  let sessionUser = sessionStorage.getItem("email");

  const coinWindow = () => {
    const coinWin = window.open(
      //ret = 창 객체
      "http://localhost:3000/ucoin",
      "_blank",
      "resizable=no, left=0, top=0, width=622, height=520"
    );
  };
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async (e) => {
    const res = await axios.post("http://localhost:3001/users/viewMyProfile", {
      sessionUser: sessionUser,
    });
    if (res.data.imgURL !== "") {
      let staticpath = "http://localhost:3001";
      setImgBase64(staticpath + res.data.imgURL);
    }
    let data = {
      nickname: res.data.nickname,
      imgURL: res.data.imgURL,
      ucoin: res.data.ucoin,
    };
    setProfileInfo(data);
  };

  return (
    <div style={{fontFamily:"NanumSquare_acR", display:"flex", flexDirection:"row", alignItems:"center"}}>
      <button
        onClick={(e) => {
          toggleProfileBtn(e);
        }}
        style={{borderRadius:"12px", padding:"0%", borderColor:"#FF6895"}}
      >
        {imgBase64 === "" ? (
          <img src={ProfileNoImage} alt="profile img" height="60" width="60" style={{borderWidth:"3%"}}/>
        ) : (
          <img src={imgBase64} alt="profile img" height="60" width="60"  style={{borderRadius:"10px"}} />
        )}
      </button>
      <div style={{display:"flex", flexDirection:"column"}}>
        <div style={{marginLeft:"2%"}}>{ProfileInfo.nickname}</div>
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
        <img style={{width:"7%", marginRight:"1%"}}src={ucoin}></img>  
        <div >{ProfileInfo.ucoin}</div>
        <button onClick={coinWindow} style={{border:"none", borderRadius:"10px", padding:"5px", fontSize:"small", marginLeft:"1%"}}>
          충전
        </button>
        </div>
        </div>
      <Modal isOpen={toggleprofile}>
        <ModalBody isOpen={toggleprofile} className="profileModal">
          <Row>
            <button
              onClick={(e) => {
                toggleProfileBtn(e);
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
          </Row>
          <Row>
            <MyProfile />
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};
export default Profile;
