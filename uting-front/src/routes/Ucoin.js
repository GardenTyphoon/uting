import React, { useEffect, useState } from "react";
import { Table, Button } from "reactstrap";
import axios from "axios";

const Ucoin = () => {
  const [ProfileInfo, setProfileInfo] = useState({
    nickname: "",
    ucoin: "",
  });
  const [cost, setCost] = useState(0);
  const [chargingCoin, setChargingCoin] = useState(0);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async (e) => {
    const res = await axios.post("http://localhost:3001/users/viewMyProfile", {
      sessionUser: `${sessionStorage.getItem("email")}`,
    });
    let data = {
      nickname: res.data.nickname,
      ucoin: res.data.ucoin,
    };
    setProfileInfo(data);
  };

  const changeRadio = (e) => {
    var parsed = e.target.value.split(",");
    setChargingCoin(parseInt(parsed[0])); //coin
    setCost(parseInt(parsed[1])); //cost
  };

  return (
    <div>
      코인 충전
      <dl>
        <dt>{ProfileInfo.nickname} 님</dt>
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
            <td>7000</td>
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
            <td>13000</td>
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
            <td>60000</td>
            <td>15%</td>
          </tr>
        </tbody>
      </Table>
      <div>
        충전 후 Ucoin :{" "}
        <strong> {ProfileInfo.ucoin + chargingCoin} UCOIN</strong>
        <br />총 결제 금액 : <strong> {cost} 원</strong>
      </div>
      <Button>결제하기</Button>
    </div>
  );
};

export default Ucoin;
