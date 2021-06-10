import React, { useState, useEffect } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import "./SignIn.css";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

import introLog from "../../img/배경없는유팅로고.png";

const loginInstance = axios.create((config) => {
  config.headers["Content-Type"] = "application/json";
});

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [islogined, setIslogined] = useState(false);
  const [error, setError] = useState("");
  const [getalert, setGetalert] = useState({ flag: false, message: "" });

  const enterEvent = (e) => {
    if (e.key === "Enter") {
      console.log(e.key);
      onSubmit();
    }
  };
  /*컴포넌트 마운트 될 때마다 로그인 했는지 안했는지 확인*/
  useEffect(() => {
    if (sessionStorage.getItem("email")) {
      setIslogined(true);
    } else {
      setIslogined(false);
    }
    setGetalert({ flag: false, message: "" });
  }, []);

  const onChangehandler = (e) => {
    let { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  /*로그인 하는 함수*/
  const onSubmit = async (e) => {
    //e.preventDefault();
    let data = {
      email: email,
      password: password,
    };
    await loginInstance
      .post("http://localhost:3001/users/signin", data)
      .then((res) => {
        if (res.data.message === "login failed") {
          setIslogined(false);
          setGetalert({
            flag: true,
            message: "아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.",
          });
          setTimeout(() => {
            setGetalert({ flag: false, message: "" });
          }, 1500);
          //toast("아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.")
        } else if (res.data.message === "hell") {
          setGetalert({
            flag: true,
            message:
              "신고가 3번이상 누적된 사용자로서 더 이상 U-TING 서비스 사용이 불가합니다.",
          });
          setTimeout(() => {
            setGetalert({ flag: false, message: "" });
          }, 1500);
        } else {
          console.log(res.data);
          try {
            setIslogined(true);
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("nickname", res.data.perObj.nickname);
            sessionStorage.setItem("email", email);
            setGetalert({ flag: true, message: "로그인 되었습니다." });

            if (email === "sumiiniii@ajou.ac.kr") {
              window.location.href = "http://localhost:3000/admin";
            } else {
              setTimeout(() => {
                window.location.href = "http://localhost:3000/main";
              }, 1000);
            }
          } catch (error) {
            setError(error.message);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <Container className="SignInContainer">
      <Row>
        <Col className="InputContainer">
          <input
            className="signInInput"
            name="email"
            type="email"
            placeholder="ID"
            required
            value={sessionStorage.getItem("email")}
            onChange={(e) => onChangehandler(e)}
            onKeyPress={(e) => enterEvent(e)}
          />
          <input
            className="signInInput"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onKeyPress={(e) => enterEvent(e)}
            onChange={(e) => onChangehandler(e)}
          />
        </Col>
        <Col className="SignInBtnContainer">
          <button className="DoSignIn" onClick={(e) => onSubmit(e)}>
            로그인
          </button>
        </Col>
      </Row>
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
              fontSize: "18px",
              height: "50px",
            }}
          >
            {getalert.message}
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
};
export default SignIn;
