import React, { useEffect, useState } from "react";
import { Table, Button,  Modal,
  ModalHeader,
  ModalBody } from "reactstrap";
import jwtAxios from "../../utils/jwtAxios";
import "./Ucoin.css";
import introLogo from "../../img/배경없는유팅로고.png"
const Ucoin = ({checkMycoin}) => {
  const [ProfileInfo, setProfileInfo] = useState({
    _id: "",
    nickname: "",
    ucoin: Number(0),
    name: "",
    phone: "",
    email: "",
  });
  const [cost, setCost] = useState(0);
  const [chargingCoin, setChargingCoin] = useState(0);
  const [getalert, setGetalert] = useState({ flag: false, message: "" });

  var IMP = window.IMP;
  IMP.init("imp28864295");

  let currentUser = sessionStorage.getItem("nickname");
  useEffect(() => {
    getProfile();
  }, []);

  const requestPay = () => {
    // IMP.request_pay(param, callback) 호출
    if (chargingCoin == 0) {
      setGetalert({ flag: true, message: "결제할 코인을 선택하세요!" });
      setTimeout(() => {
        setGetalert({ flag: false, message: "" });
      }, 1500);
    } else {
      IMP.request_pay(
        {
          // param
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: `ucoin_${ProfileInfo.nickname}_${new Date().getTime}`,
          name: `Ucoin ${chargingCoin}개`,
          amount: cost,
          buyer_email: ProfileInfo.email,
          buyer_name: ProfileInfo.name,
          buyer_tel: ProfileInfo.phone,
          //buyer_addr: "서울특별시 강남구 신사동",
          //buyer_postcode: "01181",
        },
        async (rsp) => {
          // callback
          if (rsp.success) {
            
            console.log(ProfileInfo);
            const res = await jwtAxios.post("/users/addUcoin", {
              userId: ProfileInfo._id,
              ucoin: ProfileInfo.ucoin,
              chargingCoin: chargingCoin,
            });
            var msg = "결제가 완료되었습니다.";
            msg += "\n구매 : " + rsp.name;
            msg += "\n결제 금액 : " + rsp.paid_amount + "원";

            setGetalert({ flag: true, message: msg });
            checkMycoin(true)
                
            // 결제 성공 시 로직,
          } else {
            var msg = "결제에 실패하였습니다.";
            msg += "\n에러내용 : " + rsp.error_msg;
            setGetalert({ flag: true, message: msg });
            setTimeout(() => {
              setGetalert({ flag: false, message: "" });
            }, 1500);

            // 결제 실패 시 로직,
          }
        }
      );
    }
  };

  const addUcoin = () => {
    console.log(ProfileInfo);
    const res = jwtAxios.post("/users/addUcoin", {
      userId: ProfileInfo._id,
      ucoin: ProfileInfo.ucoin,
      chargingCoin: chargingCoin,
    });
  };

  const getProfile = async (e) => {
    const res = await jwtAxios.post("/users/viewMyProfile", {
      sessionUser: `${sessionStorage.getItem("email")}`,
      type: "profile",
    });
    let data = {
      _id: res.data._id,
      name: res.data.name,
      nickname: res.data.nickname,
      ucoin: res.data.ucoin,
      email: res.data.email,
      phone: res.data.phone,
    };
    setProfileInfo(data);
  };

  const changeRadio = (e) => {
    var parsed = e.target.value.split(",");
    setChargingCoin(parseInt(parsed[0])); //coin
    setCost(parseInt(parsed[1])); //cost
  };

  return (
    <div
      style={{
        backgroundColor: "#ffe4e1",
        fontFamily:"NanumSquare_acR"
      }}
    >
      <dl
        style={{
          margin: "0 0 30px 0",
          padding: "16px 0 0 17px",
          height: "80px",
        }}
      >
        <dt>{currentUser} 님</dt>
        <dd>
          현재 보유 Ucoin : <strong> {ProfileInfo.ucoin} UCOIN</strong>
        </dd>
      </dl>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>코인 개수</th>
            <th>결제 금액</th>
            <th>할인율</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="radio"
                name="selectNum"
                value="1,1500"
                onChange={(e) => changeRadio(e)}
              />
            </td>
            <td>1</td>
            <td>1500</td>
            <td></td>
          </tr>
          <tr>
            <td>
              <input
                type="radio"
                name="selectNum"
                value="5,7000"
                onChange={(e) => changeRadio(e)}
              />
            </td>
            <td>5</td>
            <td>7125</td>
            <td>5%</td>
          </tr>
          <tr>
            <td>
              <input
                type="radio"
                name="selectNum"
                value="10,13000"
                onChange={(e) => changeRadio(e)}
              />
            </td>
            <td>10</td>
            <td>13500</td>
            <td>10%</td>
          </tr>
          <tr>
            <td>
              <input
                type="radio"
                name="selectNum"
                value="50,60000"
                onChange={(e) => changeRadio(e)}
              />
            </td>
            <td>50</td>
            <td>31500</td>
            <td>30%</td>
          </tr>
        </tbody>
      </Table>
      <div
        style={{
          margin: "0 30px 30px 30px",
          padding:"2px"
          
        }}
      >
        충전 후 Ucoin :{" "}
        <strong> {ProfileInfo.ucoin + chargingCoin} UCOIN</strong>
        <br />총 결제 금액 : <strong> {cost} 원</strong>
      </div>
      <Button onClick={requestPay} className="payBtn" style={{  border: "none"}}>
        결제하기
      </Button>
      <Modal isOpen={getalert.flag}>
        <ModalHeader style={{ height: "70px", textAlign: "center" }}>
          <img
            style={{
              width: "40px",
              height: "40px",
              marginLeft: "210px",
              marginBottom: "1000px",
            }}
            src={introLogo}
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

export default Ucoin;
