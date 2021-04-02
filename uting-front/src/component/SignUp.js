import React,{useEffect, useState} from "react";
import {dbService} from "../firebase"
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';

const SignUp = () => {

    const [userinfo,setUserinfo]=useState({
        name:"",
        nickname:"",
        gender:"",
        birth:"",
        email:"",
        password:"",
    })
  

    // mount 될 때마다 nweet 가져오는 함수를 불러오는 

    // nweets 컬렉션에 
   
  return (
    <div>
        <strong>회원가입</strong>

        <h3>이름</h3>
        <InputGroup>
            <h4>이름</h4>
            <Input type="text" name="name"placeholder="name" />

            <h4>이메일</h4>
            <Input type="email" name="email"placeholder="email" />
      
            <h4>비밀번호</h4>
            <Input type="password" name="password" placeholder="password" />
            <Button>Submit</Button>
            <Badge color="primary" pill>Primary</Badge>
        </InputGroup>
           
       
       
        
    
    </div>
  );
};

export default SignUp;
