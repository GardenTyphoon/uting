import React,{useEffect, useState} from "react";
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';
import { useHistory } from "react-router-dom";

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
  let history = useHistory();
  /*사용자 정보*/
  const [userinfo,setUserinfo]=useState({
    name:"",
    nickname:"",
    gender:"",
    birth:"",
    email:"",
    password:"",
    phone:"",
  })
  /*U-TING이 제공한 인증코드*/
  const [code,setCode]=useState('');

  /*사용자가 입력한 인증코드*/
  const [usercode,setUsercode]=useState('');

  /*인증코드 옳은지 확인용*/
  const [checkcode,setCheckcode]=useState(false);

  /*본인인증과 연관된 가맹점 내부 주문번호*/
  const [merchantid,setMerchantid]=useState(`mid_${new Date().getTime()}`);

  /*본인인증 성공 여부*/
  const [identity,setIdentity]=useState('');

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
    if(checkcode===true&&userinfo.name!==""&&userinfo.nickname!==""&&userinfo.gender!==""&&userinfo.birth!==""&&userinfo.email!==""&&userinfo.password!==""&&(identity!=='false'&&identity!=='')){

      let data = {
        name:userinfo.name,
        nickname:userinfo.nickname,
        gender:userinfo.gender,
        birth:userinfo.birth,
        email:userinfo.email,
        password:userinfo.password,
        phone:userinfo.phone,
      }

      const res = await axios.post('http://localhost:3001/users/signup',data);
      console.log(res.data)
      
      setUserinfo({
          name:"",
          nickname:"",
          gender:"",
          birth:"",
          email:"",
          password:"",
          phone:"",

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


  /*본인인증*/
  function onClickCertification() {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init('imp10391932');
    const data = {
      merchant_uid:merchantid,
      name:userinfo.name,
      phone:userinfo.phone,
    };
    /* 4. 본인인증 창 호출하기 */
    IMP.certification(data, callback);
  }

  /* 3. 콜백 함수 정의하기 */
  function callback(response) {

    console.log("콜백함수")
    console.log(response)
    const {
      success,
      merchantid,
      name,
      phone,
      error_msg,
    
    } = response;
    if (success) {
      setIdentity('true');
    } else {
      setIdentity('false');

    }
  }

  useEffect(()=>{
    if(identity==='true'){
      alert("본인인증 성공 !")
    }
    else if(identity==='false'){
      alert('본인인증 실패');
    }
  },[identity])
   
  return (
    <div>
        <strong>회원가입</strong>
        
        <SignUpBox>
            <div>이름</div>
            <Input type="text" name="name"placeholder="이름"
            onChange={(e) => onChangehandler(e)} />
        </SignUpBox>
        <SignUpBox>
            <div>전화번호</div>
            <Input type="text" name="phone"placeholder="01000000000"
            onChange={(e) => onChangehandler(e)} />
        </SignUpBox>
        {identity!=='true'?<Button onClick={onClickCertification}>본인인증 하기</Button>:<div >본인 인증 성공 ! </div>}
        
        <SignUpBox>
          <div>생년월일</div>
            <Input type="text" name="birth"placeholder="yyyymmdd" onChange={(e) => onChangehandler(e)}/>
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
