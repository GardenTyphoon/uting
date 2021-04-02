import React,{useEffect, useState} from "react";
import {dbService} from "../firebase"
import { Route, Link } from 'react-router-dom';
// import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';

const SignIn = () => {

   
  return (
    <div>
      로그인

      <div>회원이 아니신가요?</div>
      <Link to="/signup">회원가입하기</Link>
    </div>
  );
};

export default SignIn;
