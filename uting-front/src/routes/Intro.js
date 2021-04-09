import React,{useEffect, useState} from "react";
import { Route, Link,Switch,Router } from 'react-router-dom';

import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';
import SignIn from '../components/user/SignIn';
import Main from './Main';

const Intro = () => {
  const [init,setInit]=useState(false);
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [userObj,setUserObj]=useState(null);
  const [cnt,setCnt]=useState(0);
  
  //컴포넌트가 mount 될 때 실행되는 것
  useEffect(()=>{
    if(sessionStorage.getItem("email")){
      setIsLoggedIn(true)
    }
    else{
      setIsLoggedIn(false)
    }
  },[])
  
  return (
    <div>
      {isLoggedIn===false?
      <div>
        <Link to="/admin">관리자페이지</Link>
        <SignIn/>
      </div>
      
      :<Main/>
      }
      
    </div>
    
                    
  )
      
};

export default Intro;
