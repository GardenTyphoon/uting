import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import introLog from "../../img/배경없는유팅로고.png";
import {
  Input,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import defaultAxios from "../../utils/defaultAxios";
import "./FindPassword.css"
const FindPassword = () => {
  let history = useHistory();
  const [userinfo, setUserinfo] = useState({
    name: "",
    email: "",
    phone: "",
    newPassword: "",
  });
  const [code, setCode] = useState("");
  const [merchantid, setMerchantid] = useState(`mid_${new Date().getTime()}`);
  const [identity, setIdentity] = useState("");
  const [checkcode, setCheckcode] = useState();
  const [usercode, setUsercode] = useState("");
  const [nextBtn, setNextBtn] = useState(false);
  const [newPasswordTemp, setNewPasswordTemp] = useState("");
  const [getalert, setGetalert] = useState({ flag: false, message: "" });

  let toggleAlert = (e) => {
    setGetalert({ ...getalert, flag: !getalert.flag });
  };
  const onChangehandler = (e) => {
    let { name, value } = e.target;
    if (name === "check-email") {
      setUsercode(value);
    } else if (name === "newPasswordTemp") {
      setNewPasswordTemp(value);
    } else {
      setUserinfo({
        ...userinfo,
        [name]: value,
      });
    }
  };

  const changePassword = async () => {
    if (newPasswordTemp === userinfo.newPassword) {
      console.log(newPasswordTemp);
      let data = { userinfo: userinfo };
      const res = await defaultAxios.post("/users/changePassword", data);
      console.log(res.data);
      setGetalert({ flag: true, message: res.data });
      if (res.data === "비밀번호가 성공적으로 변경되었습니다.") {
        console.log("비밀번호가 성공적으로~~");
        window.location.reload();
      } else {
        console.log("이전에 사용하신~~")
        setTimeout(() => {
          setGetalert({ flag: false, message: "" });
        }, 1500);
      }
    } else {
      setGetalert({
        flag: true,
        message: "입력하신 비밀번호가 일치하지 않습니다.",
      });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    }
  };
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
  function callback(response) {
    const { success, merchantid, name, phone, error_msg } = response;
    if (success) {
      setIdentity("true");
    } else {
      setIdentity("false");
    }
  }

  let sendEmail = async (e) => {
    e.preventDefault();
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
  return (
    <div>
      {checkcode === true && nextBtn === true ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: "NanumSquare_acR" }}>
            <div className="FindPasswordEachRow">
              <div className="FindPasswordTitle" style={{ width: "80px" }}>새 비밀번호</div>
              <Input
                type="password"
                name="newPasswordTemp"
                placeholder="새 비밀번호를 입력하세요."
                style={{
                  width: "300px",
                  fontFamily: "NanumSquare_acR",
                  margin: "10px",
                }}
                onChange={(e) => onChangehandler(e)}
                value={newPasswordTemp}
              />

            </div>
            <div style={{ fontSize: "small", color: "#ff6994", marginLeft: "16%" }}>*영문 대소문자, 숫자 및 특수문자 (!,@,#,$,%,^,&,*) 조합 8자리 </div>

            <div className="FindPasswordEachRow">
              <div className="FindPasswordTitle" style={{ width: "80px" }}>새 비밀번호 확인</div>
              <Input
                type="password"
                name="newPassword"
                placeholder="새 비밀번호를 한번 더 입력하세요."
                style={{
                  width: "300px",
                  fontFamily: "NanumSquare_acR",
                  margin: "10px",
                }}
                onChange={(e) => onChangehandler(e)}
                value={userinfo.newPassword}
              />
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="gradientBtn" onClick={() => changePassword()} style={{ width: "100px" }}>
              변경하기
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: "NanumSquare_acR" }}>
            <div className="FindPasswordEachRow">
              <div className="FindPasswordTitle">이름</div>
              <Input
                type="text"
                name="name"
                placeholder="이름을 입력해주세요."
                style={{
                  width: "300px",
                  fontFamily: "NanumSquare_acR",
                  margin: "10px",
                }}
                onChange={(e) => onChangehandler(e)}
              />
            </div>

            <div className="FindPasswordEachRow">
              <div className="FindPasswordTitle">전화번호</div>
              <Input
                type="text"
                name="phone"
                placeholder="전화번호를 입력해주세요. ('-' 제외)"
                style={{
                  width: "300px",
                  fontFamily: "NanumSquare_acR",
                  margin: "10px",
                }}
                onChange={(e) => onChangehandler(e)}
              />
              <button className="gradientBtn" onClick={onClickCertification} style={{ width: "80px", margin: "0px" }}>
                본인인증
              </button>
            </div>

            <div className="FindPasswordEachRow">
              <div className="FindPasswordTitle">이메일</div>
              <Input
                type="text"
                name="email"
                placeholder="학교 이메일을 입력해주세요."
                style={{
                  width: "300px",
                  fontFamily: "NanumSquare_acR",
                  margin: "10px",
                }}
                onChange={(e) => onChangehandler(e)}
              />
              <button className="gradientBtn" style={{ width: "80px", margin: "0px" }} onClick={(e) => sendEmail(e)}>
                대학 인증
              </button>
            </div>


            <div className="FindPasswordEachRow">
              <div className="FindPasswordTitle">인증코드</div>
              <Input
                type="text"
                name="check-email"
                placeholder="인증 코드를 입력해주세요."
                style={{
                  width: "300px",
                  fontFamily: "NanumSquare_acR",
                  margin: "10px",
                }}
                onChange={(e) => onChangehandler(e)}
              />
              <button className="gradientBtn" style={{ width: "80px", margin: "0px" }} onClick={(e) => check(e)}>
                확인
              </button>
            </div>

          </div>
          <div style={{ textAlign: "center" }}>
            <button
              className="gradientBtn"
              onClick={() => setNextBtn(!nextBtn)}
              style={{ width: "100px" }}
            >
              다음 단계
            </button>
          </div>
        </div>
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
    </div>
  );
};
export default FindPassword;