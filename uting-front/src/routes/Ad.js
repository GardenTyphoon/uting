import React, { useEffect, useState } from "react";
import { Route, Link, Switch, Router, useHistory } from "react-router-dom";
import {
  Button,
  Collapse,
  CardBody,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import defaultAxios from "../utils/defaultAxios";
import "./Ad.css";
import utingLogo from "../img/utingLogo.png";
import FormData from "form-data";
import ProfileNoImage from "../img/ProfileNoImage.jpg";
import introLog from "../img/배경없는유팅로고.png";
const Ad = () => {
  const [content, setContent] = useState(
    {requesttype:"",last:"",first:"",company:"",email:"",domainaddress:"",file:"",
    title:"",textarea:""});
  const [imgBase64, setImgBase64] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [getalert, setGetalert] = useState({ flag: false, message: "" });

  let onChangehandler = (e) => {
    let { name, value } = e.target;
    
    setContent({ ...content, [name]: value });
  };

  const onChangeImg = async (e) => {
    // 이미지를 선택했으면
    let { name, value } = e.target;
    console.log(name)
    console.log(value)
    setContent({ ...content, [name]: value });
    let reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) {
        setImgBase64(base64.toString());
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      // 이미지 이름 저장해둠
      setImgFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    console.log(imgFile);
  }, [imgFile]);

  let submit = async (e) => {
    console.log(content)
    if(content.requesttype===""||content.last===""||content.first===""||content.company===""||content.email===""||content.domainaddress===""||content.file===""||content.title===""||content.textarea===""){

      setGetalert({
        flag: true,
        message: "입력하지 않은 값이 있습니다.",
      });

      setTimeout(()=>{
        setGetalert({
          flag: false,
          message: "",
        });
      },1500)
    }
    else{
      console.log(content)
      if (imgFile != null) {
        let formData = new FormData();
        formData.append("img", imgFile);
        formData.append("requester", content.last + content.first);
        let res = await defaultAxios.post("/ads/uploadAdImg", formData);
  
        content["file"] = res.data.url;
        
      }
      let data = {
        type: content.requesttype,
        name: content.last + content.first,
        email: content.email + "@" + content.domainaddress,
        file: content.file,
        contents: content.textarea,
        title: content.title,
      };
      console.log(data);
      const res = await defaultAxios.post("/ads/save", data);
      console.log(res);
      if (res.data === "요청완료") {
        setGetalert({
          flag: true,
          message: "접수가 완료되었습니다.",
        });
        setTimeout(()=>{
          setGetalert({
            flag: false,
            message: "",
          });
        },1500)
        window.location.reload();
      }
    }
   
  };

  return (
    <div className="adContainer">
      <img className="utingLogo" src={utingLogo} />
      <div className="contactus">Contact Us</div>
      <div>
        <div className="request">문의 약관</div>
        <div className="checkcontent">
          ‘U-TING’(이하 ‘회사’)은 고객님의 개인정보를 중요시하며, “정보통신망
          이용촉진 및 정보보호”에 관한 법률을 준수하고 있습니다.
          <br />
          회사는 개인정보 처리방침을 통하여 고객님께서 제공하시는 개인정보가
          어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한
          조치가 취해지고 있는지 알려드립니다.
          <br />
          회사는 개인정보취급방침을 개정하는 경우 웹사이트 공지사항(또는
          개별공지)을 통하여 공지할 것입니다.
          <br />
          <br />
          [수집하는 개인정보 항목]
          <br />
          회사는 원활한 고객상담 서비스의 제공을 위해 아래와 같은 개인정보를
          수집하고 있습니다.
          <br />
          수집항목: 이름, 이메일
          <br />
          <br />
          [개인정보의 수집 및 이용목적]
          <br />
          가. 개인식별 및 서비스 문의에 대한 응대
          <br />
          <br />
          [개인정보의 보유 및 이용기간]
          <br />
          이용자의 개인정보는 원칙적으로, 개인정보 수집 및 이용목적이 달성되면
          지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한
          기간 동안 보존합니다.
          <br />
          <br />
          가. 회사 내부 방침에 의한 정보보유 사유
          <br />
          부정이용 기록 보존 이유 : 부정 이용 예방 및 방지, 보존 기간 : 1년
          <br />
          <br />
          나. 관계법령에 의한 정보보유 사유
          <br />
          상법, 전자상거래법 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우
          회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다. 이
          경우 회사는 보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은
          아래와 같습니다.
          <br />
          <br />
          - 소비자의 불만 또는 분쟁처리에 관한 기록 | 보존 이유 : 전자상거래법,
          보존 기간 : 3년
          <br />
          - 본인 확인에 관한 기록 | 보존 이유 : 정보통신망법, 보존 기간 : 6개월
          <br />- 방문에 관한 기록(통신사실확인자료) | 보존 이유 : 통신비밀
          보호법, 보존 기간 : 3개월
        </div>
      </div>
      <div
        className="formcheck"
        style={{ float: "left", marginLeft: "25%", marginTop: "1%" }}
      >
        <input onChange={(e) => onChangehandler(e)} name="agree" type="radio" />
        <span style={{ marginLeft: "1%" }}>
          개인 정보 취급 방침에 동의합니다.
        </span>
      </div>

      <div className="tablediv">
        <table>
          <tbody>
            <tr>
              <th >질문유형</th>
              <td>
                <div className="td-div">
                  <Input
                    onChange={(e) => onChangehandler(e)}
                    type="radio"
                    name="requesttype"
                    value="Ad"

                  />
                  <label for="inquiryCd1" style={{marginRight:"2%"}}>광고</label>
                  <Input
                    onChange={(e) => onChangehandler(e)}
                    type="radio"
                    name="requesttype"
                    value="another"
                    style={{marginLeft:"1%"}}
                  />
                  <label  style={{marginLeft:"7%"}} for="inquiryCd1">기타</label>
                </div>
              </td>
            </tr>
            <tr>
              <th >성, 이름</th>
              <td>
                <div className="td-div" >
                  <input
                    onChange={(e) => onChangehandler(e)}
                    type="text"
                    name="last"
                    placeholder="성"
                    style={{border:"none",borderRadius:"10px",height:"40px",marginRight:"2%"}}
                  />
                  <input
                    onChange={(e) => onChangehandler(e)}
                    type="text"
                    name="first"
                    placeholder="이름"
                    style={{border:"none",borderRadius:"10px",height:"40px"}}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th >회사명</th>
              <td>
                <div className="td-div">
                  <input
                    onChange={(e) => onChangehandler(e)}
                    type="text"
                    name="company"
                    placeholder="회사명"
                    style={{border:"none",borderRadius:"10px",height:"40px"}}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th >이메일</th>
              <td style={{width:"500px"}}>
                <div className="emailinfo">
                  <input
                    onChange={(e) => onChangehandler(e)}
                    style={{ width: "150px", float: "left",border:"none",borderRadius:"10px",height:"40px" }}
                    type="text"
                    name="email"
                  />
                  <span style={{ float: "left" }}>@</span>
                  {content.domainaddress === "1" ? (
                    <input
                      onChange={(e) => onChangehandler(e)}
                      style={{ width: "150px", float: "left"}}
                      type="text"
                      name="domainaddress"
                    />
                  ) : (
                    ""
                  )}

                  <Input
                    onChange={(e) => onChangehandler(e)}
                    style={{ width: "150px", float: "left" }}
                    id="domainaddress"
                    type="select"
                    name="domainaddress"
                  >
                    <option value="" selected="selected">
                      주소선택
                    </option>
                    <option value="1">직접입력</option>
                    <option value="naver.com">naver.com</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="daum.net">daum.net</option>
                    <option value="nate.com">nate.com</option>
                  </Input>
                </div>
              </td>
            </tr>
            <tr>
              <th >파일</th>
              <td>
                <div className="td-div">
                  {imgBase64 === "" ? (
                    <img
                      style={{ width: "80px", height: "80px", margin: "10px" }}
                      src={ProfileNoImage}
                    />
                  ) : (
                    <img
                      style={{
                        width: "120px",
                        height: "120px",
                        margin: "10px",
                      }}
                      src={imgBase64}
                    />
                  )}
                  <input
                    onChange={(e) => onChangeImg(e)}
                    accept="image/*"
                    type="file"
                    name="file"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th >제목</th>
              <td>
                <div className="td-div">
                  <input
                    onChange={(e) => onChangehandler(e)}
                    type="text"
                    name="title"
                    style={{border:"none",borderRadius:"10px",height:"40px"}}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th >문의내용</th>
              <td>
                <div className="td-div">
                  <textarea
                    onChange={(e) => onChangehandler(e)}
                    type="textarea"
                    name="textarea"
                    style={{resize:"none",width:"600px",height:"160px",border:"none",borderRadius:"10px"}}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <Button style={{marginLeft:"30%",width:"150px",height:"50px"}} onClick={(e) => submit(e)}>접수</Button>
      </div>
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

export default Ad;
