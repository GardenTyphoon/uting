import React,{useEffect, useState} from "react";
import {dbService,authService} from "../../firebase"
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';

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

  /*사용자 정보*/
  const [userinfo,setUserinfo]=useState({
    name:"",
    nickname:"",
    gender:"",
    birth:"",
    email:"",
    password:"",
  })
  /*U-TING이 제공한 인증코드*/
  const [code,setCode]=useState('');

  /*사용자가 입력한 인증코드*/
  const [usercode,setUsercode]=useState('');

  /*인증코드 옳은지 확인용*/
  const [checkcode,setCheckcode]=useState(false);



  let onChangehandler = (e) => {
    let { name, value } = e.target;
    if(name==="check-email"){
      setUsercode(value);
    }
    else{
      setUserinfo({
        ...userinfo,
        [name]: value,
    });
    }
    
  };

  /*사용자 정보 firebase storage에 저장하기 - 회원가입!*/
  let onSignupSubmit = async(e) => {
    e.preventDefault();
    console.log(userinfo)
    if(checkcode===true&&userinfo.name!==""&&userinfo.nickname!==""&&userinfo.gender!==""&&userinfo.birth!==""&&userinfo.email!==""&&userinfo.password!==""){

      let data = {
        name:userinfo.name,
        nickname:userinfo.nickname,
        gender:userinfo.gender,
        birth:userinfo.birth,
        email:userinfo.email,
        password:userinfo.password
      }

      const res = await axios.post('http://localhost:3001/users/signup',data);
      console.log(res.data)
      let authdata;
      authdata = await authService.createUserWithEmailAndPassword(
        userinfo.email,
        userinfo.password
      );
      
      setUserinfo({
          name:"",
          nickname:"",
          gender:"",
          birth:"",
          email:"",
          password:"",
      })
      alert("회원가입이 안료되었습니다.");
      window.location.href = 'http://localhost:3000/';
    }
    else{
      alert("입력하지 않은 정보가 있습니다.")
    }
    
  }

  /*대학생 인증 및 이메일 인증 코드 전송*/
  let sendEmail = async(e)=>{
    e.preventDefault();
    const data={
      email:userinfo.email
    }

    if(data.email.slice(-6)===".ac.kr"){
      const res = await axios.post('http://localhost:3001/users/sendEmail',data);
      setCode(res.data);
      console.log(res)

    }
    else{
      alert("대학교 이메일로만 가입이 가능합니다.")
    }
  }

  /*발급된 인증코드와 맞는지 체크하는 함수*/
  let check = (e) =>{
    if(code===usercode){
      setCheckcode(true);
      if(checkcode===true){
        alert("인증코드 확인이 완료되었습니다.")
      }
    }
    else{
      setCheckcode(false);
      alert("인증코드가 틀렸습니다.")
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
            <Input type="text" name="check-email" placeholder="인증번호" onChange={(e) => onChangehandler(e)} />
            <Button onClick={(e)=>check(e)}>확인</Button>
        </SignUpBox>
        <SignUpBox>
          <div>비밀번호</div>
            <Input type="password" name="password" placeholder="password" onChange={(e) => onChangehandler(e)}/>
        </SignUpBox>
         {checkcode===true?<Button onClick={(e)=>onSignupSubmit(e)}>가입</Button>:""}
            
    </div>
  );
};

export default SignUp;
