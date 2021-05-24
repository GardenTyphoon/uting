import React, { useState, useEffect } from 'react';
import { Route, Link, Switch, Router } from 'react-router-dom';
import "./SignIn.css"
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [islogined, setIslogined] = useState(false);
  const [error, setError] = useState("");
  

  /*컴포넌트 마운트 될 때마다 로그인 했는지 안했는지 확인*/
  useEffect(() => {
    if (sessionStorage.getItem("email")) {
      setIslogined(true)
      
    }
    else {
      setIslogined(false)
    }
  }, [])

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
    e.preventDefault();
    let data = {
      email: email,
      password: password
    }
    const res = await axios.post('http://localhost:3001/users/signin', data);
    
    sessionStorage.setItem('nickname', res.data.nickname);
    if (res.data === "아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.") {
      setIslogined(false);
      alert("아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.")
      //toast("아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.")
      
    }
    else {
      try {
        setIslogined(true);
        
        sessionStorage.setItem('email', email);
        alert("로그인 되었습니다.")
        //toast("로그인 되었습니다.")
        //소켓
        
        if(email==="admin@ajou.ac.kr"){
          window.location.href = 'http://localhost:3000/admin';
        }
        else{
          window.location.href = 'http://localhost:3000/main';
 
        }

      } catch (error) {
        setError(error.message);
      }
    }
  };
  return (
    <Container className="SignInContainer">
      <Row >
        <Col className="InputContainer">
          <input
            className="signInInput"
            name="email"
            type="email"
            placeholder="ID"
            required
            value={sessionStorage.getItem("email")}
            onChange={(e) => onChangehandler(e)}
          />
          <input
            className="signInInput"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => onChangehandler(e)}
          />
        </Col>
        <Col className="SignInBtnContainer">
          <button className="DoSignIn" onClick={(e) => onSubmit(e)}>로그인</ button>
        </Col>
      </Row>
    </Container>
  );
};
export default SignIn;