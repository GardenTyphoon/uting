import React, { useEffect, useState } from "react";
import { Route, Link, Switch, Router, useHistory } from "react-router-dom";
import {
  Button,
  Collapse,
  CardBody,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "./Intro.css";
import SignIn from "../components/user/SignIn";
import Main from "./Main";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";
import introLog from '../img/인트로유팅로고.png'
import intromessage from '../img/인트로메시지.png'
import labelsticker from '../img/라벨지.png'
const Intro = () => {
  const history = useHistory();
  const [toggleSignIn, setToggleSignIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const onClick = () => {
    history.push({
      pathname: `/signUp`,
    });
  };
  const goMain = () => {
    history.push({
      pathname: `/main`,
    });
  };

  let logout = async (e) => {

    let data = { email: sessionStorage.getItem("email") }
    console.log(data)
    const res = await axios.post('http://localhost:3001/users/logout', data)
    if (res.data === "success") {
      sessionStorage.clear();
      window.location.href = "http://localhost:3000/";
    }
    if (res.data === "no") {
      alert("Error")
    }
  }

  const toggleSignInBtn = (e) => {
    setToggleSignIn(!toggleSignIn);
  };
  //컴포넌트가 mount 될 때 실행되는 것
  useEffect(() => {
    if (sessionStorage.getItem("email")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="IntroContainer">

      <Row className="signinclass">

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginRight: "20px" }}>
          <img className="intrologo" src={introLog} />
          <img className="intromessage" src={intromessage}></img>
        </div>
        <Col>
          <div className="col2">
            {isLoggedIn === false ? <><SignIn />
              <div className="createaccount">
                <button className="MiddleBtn" onClick={onClick}>
                  계정 만들기
                </button>
              </div></> 
              : 
              <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                <div className="Logoutcontainer">
                  <span className="logoutname">{sessionStorage.getItem("nickname")}님 <br></br> 반갑습니다.</span>
                  <button onClick={(e) => logout(e)} className="LogInOutBtn">Logout</button></div>
                <button className="MiddleBtn" onClick={goMain}>
                  미팅 즐기러 가기
                </button>
              </div>}
          </div>
        </Col>
      </Row>

      <div className="diva" ><Link className="divad" to="/ad">광고 문의</Link></div>
    </div>
  );
};

export default Intro;
