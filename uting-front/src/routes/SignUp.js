import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Input,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import defaultAxios from "../utils/defaultAxios";
import { useHistory } from "react-router-dom";
import { is } from "date-fns/locale";
import "./SignUp.css";
import introLog from "../img/배경없는유팅로고.png";
const SignUpContainer = styled.div`
  margin: 0 auto;
  padding: 10vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffe4e1;
`;
const SignUpTitle = styled.div`
  font-family: NanumSquare_acR;
  font-size: x-large;
  font-weight: 900;
  font-color: ;
`;
const SignUpBox = styled.div`
  font-family: NanumSquare_acR;
  border: 1.5px solid rgb(221, 221, 221);
  border-radius: 7px;
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 20px;
  background-color: white;
  width: 45vw;
  min-width: 500px;
  font-weight: bold;
  font-size: large;
`;
const InputandBtn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SignUp = () => {
  let history = useHistory();
  /*사용자 정보*/
  const [userinfo, setUserinfo] = useState({
    name: "",
    nickname: "",
    gender: "",
    birth: "",
    email: "",
    password: "",
    phone: "",
    ucoin: 0,
  });
  /*U-TING이 제공한 인증코드*/
  const [code, setCode] = useState("");

  /*사용자가 입력한 인증코드*/
  const [usercode, setUsercode] = useState("");

  /*인증코드 옳은지 확인용*/
  const [checkcode, setCheckcode] = useState();

  /*본인인증과 연관된 가맹점 내부 주문번호*/
  const [merchantid, setMerchantid] = useState(`mid_${new Date().getTime()}`);

  /*본인인증 성공 여부*/
  const [identity, setIdentity] = useState("");

  /*닉네임 중복 확인*/
  const [checkNickname, setCheckNickname] = useState(false);

  const [validPhone, setValidPhone] = useState(false);
  const [validBirth, setValidBirth] = useState(false);
  const [validNickname, setValidNickname] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const [getalert, setGetalert] = useState({ flag: false, message: "" });

  const onlyNumber = /^[0-9]+$/;
  const passwordContidion =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  let toggleAlert = (e) => {
    setGetalert({ ...getalert, flag: !getalert.flag });
  };

  let onChangehandler = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      if (
        value.length === 11 &&
        onlyNumber.test(value) &&
        value.slice(0, 3) === "010"
      )
        setValidPhone(true);
      else setValidPhone(false);
    }
    if (name === "birth") {
      if (value.length === 8 && onlyNumber.test(value)) setValidBirth(true);
      else setValidBirth(false);
    }
    if (name === "nickname") {
      if (value.length <= 8 && value.length > 0) setValidNickname(true);
      else setValidNickname(false);
    }
    if (name === "password") {
      if (passwordContidion.test(value)) setValidPassword(true);
      else setValidPassword(false);
    }
    if (name === "check-email") {
      setUsercode(value);
    } else if (name === "phone") {
      if (value.length === 11) setValidPhone(true);
      else setValidPhone(false);
    } else {
      setUserinfo({
        ...userinfo,
        [name]: value,
      });
    }
  };

  /*사용자 정보 firebase storage에 저장하기 - 회원가입!*/
  let onSignupSubmit = async (e) => {
    e.preventDefault();
    console.log(userinfo);
    if (
      checkcode === true &&
      userinfo.name !== "" &&
      userinfo.nickname !== "" &&
      userinfo.gender !== "" &&
      userinfo.birth !== "" &&
      userinfo.email !== "" &&
      userinfo.password !== "" &&
      identity !== "false" &&
      identity !== "" &&
      checkNickname === true
    ) {
      if (checkPassword(userinfo.password)) {
        let data = {
          name: userinfo.name,
          nickname: userinfo.nickname,
          gender: userinfo.gender,
          birth: userinfo.birth,
          email: userinfo.email,
          password: userinfo.password,
          phone: userinfo.phone,
        };

        const res = await defaultAxios.post("/users/signup", data);
        console.log(res.data);

        setUserinfo({
          name: "",
          nickname: "",
          gender: "",
          birth: "",
          email: "",
          password: "",
          phone: "",
        });
        setGetalert({ flag: true, message: "회원가입이 완료되었습니다." });
        setTimeout(() => {
          history.push("/");
        }, 1500);
      }
    } else {
      setGetalert({ flag: true, message: "입력하지 않은 정보가 있습니다." });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    }
  };

  /*대학생 인증 및 이메일 인증 코드 전송*/
  let sendEmail = async (e) => {
    
    const data = {
      email: userinfo.email,
    };

    if (data.email.slice(-6) === ".ac.kr") {
      
      const res = await defaultAxios.post("/users/sendEmail", data);
      setGetalert({
        flag: true,
        message: "해당 이메일로 인증코드를 전송했습니다.",
      });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
      setCode(res.data);
      console.log(res);
    } else {
      setGetalert({
        flag: true,
        message: "대학교 이메일로만 가입이 가능합니다.",
      });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    }
  };

  /*발급된 인증코드와 맞는지 체크하는 함수*/
  let check = (e) => {
    if (code === usercode) {
      setCheckcode(true);
      if (checkcode === true) {
        setGetalert({ flag: true, message: "인증코드 확인이 완료되었습니다." });
        setTimeout(() => {
          setGetalert({ flag: false, message: "" });
        }, 1500);
      }
    } else {
      setCheckcode(false);
      setGetalert({ flag: true, message: "인증코드가 틀렸습니다." });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    }
  };

  let overlapNickname = async (e) => {
    let data = {
      nickname: userinfo.nickname,
    };

    const res = await defaultAxios.post("/users/checknickname", data);
    if (res.data === "exist") {
      setGetalert({ flag: true, message: "이미 존재하는 닉네임입니다." });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    }
    if (res.data === "no") {
      setCheckNickname(true);
      setGetalert({ flag: true, message: "사용가능한 닉네임입니다." });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    }
  };

  /*본인인증*/
  function onClickCertification() {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init("imp10391932");
    const data = {
      merchant_uid: merchantid,
      name: userinfo.name,
      phone: userinfo.phone,
    };
    /* 4. 본인인증 창 호출하기 */
    IMP.certification(data, callback);
  }

  /* 3. 콜백 함수 정의하기 */
  function callback(response) {
    const { success, merchantid, name, phone, error_msg } = response;
    if (success) {
      setIdentity("true");
    } else {
      setIdentity("false");
    }
  }
  function checkPassword(password) {
    var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (false === reg.test(password)) {
      setGetalert({
        flag: true,
        message:
          "비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야 합니다.",
      });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
      return false;
    } else {
      return true;
    }
  }
  useEffect(() => {
    if (identity === "true") {
      setGetalert({ flag: true, message: "본인인증 성공 !" });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    } else if (identity === "false") {
      setGetalert({ flag: true, message: "본인인증 실패" });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    }
  }, [identity]);

  return (
    <SignUpContainer>
      <SignUpTitle>회원가입</SignUpTitle>

      <SignUpBox>
        <div style={{ marginBottom: "10px" }}>이름</div>
        <Input
          type="text"
          name="name"
          placeholder="이름"
          style={{ marginBottom: "20px" }}
          onChange={(e) => onChangehandler(e)}
        />

        <div style={{ marginBottom: "10px" }}>전화번호</div>
        <InputandBtn>
          <Input
            type="text"
            onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"
            name="phone"
            placeholder="01000000000"
            maxLength="11"
            style={{ width: "40vw", marginBottom: "20px", minWidth: "370px" }}
            onChange={(e) => onChangehandler(e)}
          />
          {validPhone === true ? (
            <button onClick={onClickCertification} className="gradientBtn">
              본인인증
            </button>
          ) : (
            <button
              onClick={onClickCertification}
              className="gradientBtnDisabled"
              disabled
            >
              본인인증
            </button>
          )}
        </InputandBtn>

        <div style={{ marginBottom: "10px" }}>생년월일</div>
        <Input
          type="text"
          name="birth"
          placeholder="yyyymmdd"
          style={{ marginBottom: "20px" }}
          maxLength="8"
          onChange={(e) => onChangehandler(e)}
        />
        <div>닉네임</div>
        <InputandBtn>
          <Input
            type="text"
            name="nickname"
            placeholder="8글자 이내의 닉네임"
            maxLength="8"
            style={{ width: "40vw", marginBottom: "20px", minWidth: "370px" }}
            onChange={(e) => onChangehandler(e)}
          />
          {validNickname === true ? (
            <button className="gradientBtn" onClick={(e) => overlapNickname()}>
              중복확인
            </button>
          ) : (
            <button
              className="gradientBtnDisabled"
              onClick={(e) => overlapNickname()}
              disabled
            >
              중복확인
            </button>
          )}
        </InputandBtn>

        <div style={{ marginBottom: "10px" }}>성별</div>
        <Input
          type="select"
          name="gender"
          style={{ marginBottom: "20px" }}
          onChange={(e) => onChangehandler(e)}
        >
          <option>선택해주세요.</option>
          <option value="woman">여</option>
          <option value="man">남</option>
        </Input>
        <div style={{ marginBottom: "10px" }}>대학 이메일</div>
        <InputandBtn>
          <Input
            type="email"
            name="email"
            placeholder="대학 이메일"
            style={{ width: "40vw", marginBottom: "20px", minWidth: "370px" }}
            onChange={(e) => onChangehandler(e)}
          />
          <button className="gradientBtn" onClick={(e) => sendEmail(e)}>
            이메일 인증
          </button>
        </InputandBtn>
        <div style={{ marginBottom: "10px" }}>이메일 인증코드</div>
        <InputandBtn>
          <Input
            type="text"
            name="check-email"
            placeholder="인증코드"
            style={{ width: "40vw", marginBottom: "20px", minWidth: "370px" }}
            onChange={(e) => onChangehandler(e)}
          />
          <button className="gradientBtn" onClick={(e) => check(e)}>
            확인
          </button>
        </InputandBtn>
        <div style={{ marginBottom: "10px" }}>비밀번호</div>

        <Input
          type="password"
          name="password"
          placeholder="영문 대소문자, 숫자 및 특수문자 (!,@,#,$,%,^,&,*) 조합 8자리 "
          style={{ marginBottom: "20px" }}
          onChange={(e) => onChangehandler(e)}
        />
      </SignUpBox>
      {checkcode &&
      validPhone &&
      validBirth &&
      validNickname &&
      validPassword ? (
        <button className="gradientBtn" onClick={(e) => onSignupSubmit(e)}>
          가입
        </button>
      ) : (
        <button
          className="gradientBtnDisabled"
          onClick={(e) => onSignupSubmit(e)}
          disabled
        >
          가입
        </button>
      )}
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
    </SignUpContainer>
  );
};

export default SignUp;
