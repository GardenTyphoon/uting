import React, { useState,useEffect } from 'react';
import { Route, Link,Switch,Router } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'reactstrap';


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [islogined, setIslogined] = useState(false);
  const [error,setError] = useState("");
  

  /*컴포넌트 마운트 될 때마다 로그인 했는지 안했는지 확인*/
  useEffect(()=>{
    if(sessionStorage.getItem("email")){
      setIslogined(true)
    }
    else{
      setIslogined(false)
    }
  },[])

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
      email:email,
      password:password
    }
   const res = await axios.post('http://localhost:3001/users/signin',data);
   console.log(res)

   if(res.data==="아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다."){
    setIslogined(false);
     alert("아이디 및 비밀번호가 틀렸거나, 없는 사용자입니다.")
   }
   else{
    try {
      setIslogined(true);
      sessionStorage.setItem('email', email);
      alert("로그인 되었습니다.")
      window.location.href = 'http://localhost:3000/main';
    } catch (error) {
      setError(error.message);
    }
   }
  };
  return (
    <div>
      <div>
        <input
          name="email"
          type="email"
          placeholder="이메일"
          required
          value={sessionStorage.getItem("email")}
          onChange={(e)=>onChangehandler(e)}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          value={password}
          onChange={(e)=>onChangehandler(e)}
        />
        <Button onClick={(e)=>onSubmit(e)}>로그인</Button>
        <div>
        <div>회원이 아니신가요?</div>
        <Link to="/signup">회원가입하기</Link>
        </div>
      </div>

        
    </div>
  );
};
export default SignIn;
