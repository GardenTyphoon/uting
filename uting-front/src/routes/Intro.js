import React, { useEffect, useState } from "react";
import { Route, Link, Switch, Router, useHistory } from 'react-router-dom';

import "./Intro.css"
import SignIn from '../components/user/SignIn';
import Main from './Main';

const Intro = () => {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const onClick = () => {
    history.push({
      pathname: `/signUp`

    })
  }
  //컴포넌트가 mount 될 때 실행되는 것
  useEffect(() => {
    if (sessionStorage.getItem("email")) {
      setIsLoggedIn(true)
    }
    else {
      setIsLoggedIn(false)
    }
  }, [])

  return (
    <div className="IntroContainer">
      {isLoggedIn === false ?
        <div>
          <Link to="/admin">관리자페이지</Link>
          
        {/*
          <button className="SignInBtn">로그인</button>
        */}
          <SignIn />
            
          <button className="SignUpBtn" onClick={onClick}>계정 만들기</button>

        </div>

        : <Main />
      }

    </div>


  )

};

export default Intro;
