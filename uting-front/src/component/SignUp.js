import React,{useEffect, useState} from "react";
import {dbService} from "../firebase"
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';

const SignUpBox = styled.div`
  border: 1.5px solid rgb(221, 221, 221);;
  border-radius: 7px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  background-color: white;
`;

const SignUp = () => {

    const [userinfo,setUserinfo]=useState({
        name:"",
        nickname:"",
        gender:"",
        birth:"",
        email:"",
        password:"",
    })
    let onChangehandler = (e) => {
      let { name, value } = e.target;
      setUserinfo({
          ...userinfo,
          [name]: value,
      });
      console.log(userinfo)
  };
  let onSignupSubmit = async(e) => {
    e.preventDefault();
    console.log(userinfo)
    await dbService.collection("users").add({
      name:userinfo.name,
      nickname:userinfo.nickname,
      gender:userinfo.gender,
      birth:userinfo.birth,
      email:userinfo.email,
      password:userinfo.password,
    })

    
    setUserinfo({
        name:"",
        nickname:"",
        gender:"",
        birth:"",
        email:"",
        password:"",
    })
  }

  let sendEmail = async(e)=>{
    e.preventDefault();
    console.log(userinfo.email.slice(-6))
    //if(userinfo.email.slice)
    const data={
      email:userinfo.email
    }
    if(data.email.slice(-6)===".ac.kr"){
      fetch('http://localhost:3001/users/sendEmail',{  
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then(res => console.log(res))
    .then(json => {
        console.log(json)
    })
    }
    else{
      alert("대학교 이메일로만 가입이 가능합니다.")
    }
    
  }
   
  return (
    <div>
      
        <strong>회원가입</strong>
        
        <SignUpBox>
            <div>이름</div>
            <Input type="text" name="name"placeholder="이름"
            onChange={(e) => onChangehandler(e)} />
        </SignUpBox>
        <SignUpBox>
          <div>닉네임</div>
            <Input type="text" name="nickname"placeholder="닉네임" onChange={(e) => onChangehandler(e)} />
        </SignUpBox>
        <SignUpBox>
          <div>성별</div>
          <Input type="select" name="gender" onChange={(e) => onChangehandler(e)}>
          <option>선택해주세요.</option>
          <option value="woman">여</option>
          <option value="man">남</option>
        </Input>
        </SignUpBox>
        <SignUpBox>
          <div>생년월일</div>
            <Input type="text" name="birth"placeholder="yyyymmdd" onChange={(e) => onChangehandler(e)}/>
        </SignUpBox>
        <SignUpBox>
          <div>이메일</div>
            <Input type="email" name="email"placeholder="이메일" onChange={(e) => onChangehandler(e)}/>
            <Button onClick={(e)=>sendEmail(e)}>이메일 인증하기</Button>
        </SignUpBox>
        <SignUpBox>
          <div>인증번호</div>
            <Input type="text" name="check-email" placeholder="인증번호" />
            <Button>확인</Button>
        </SignUpBox>
        <SignUpBox>
          <div>비밀번호</div>
            <Input type="password" name="password" placeholder="password" onChange={(e) => onChangehandler(e)}/>
        </SignUpBox>
         
            <Button onClick={(e)=>onSignupSubmit(e)}>가입</Button>
      
    </div>
  );
};

export default SignUp;
