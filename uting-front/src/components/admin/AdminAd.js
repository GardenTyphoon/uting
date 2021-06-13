import React, { useState, useEffect } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import defaultAxios from "../../utils/defaultAxios";
import styled from "styled-components";
import classnames from "classnames";
import Conversation from "./Conversation";
import GameRecom from "./GameRcom";
import ProfileNoImage from "../../img/ProfileNoImage.jpg";
import baseurl from "../../utils/baseurl";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardDeck,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Collapse,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  Jumbotron,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Fade,
} from "reactstrap";


const AdminAd = () => {
  const [open, setOpen] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [clickData, setClickData] = useState({});
  const [imgBase64, setImgBase64] = useState("");
  const [modal, setModal] = useState(false);

  const modaltoggle = (e) => {
    setModal(!modal);
  };

  const fadetoggle = (e, i) => {
    setFadeIn(!fadeIn);
    let data = {
      _id: e._id,
      name: e.name,
      num: i,
      email: e.email,
      file: e.file,
      contents: e.contents,
      status: e.status,
    };
    setClickData(data);
    // let staticpath = `${baseurl.baseBack}`;
    setImgBase64(e.file);
  };
  let isOpen = () => {
    setOpen(!open);
  };

  let getAd = async (e) => {
    await defaultAxios
      .post("/ads/adslist")
      .then(({ data }) => {
        setRequestList(data);
      })
      .catch((err) => {});
  };

  let reject = async (e) => {
    console.log("reject");
    const res = await defaultAxios.post("/ads/reject", { _id: clickData._id });
    console.log(res.data);
    if (res.data === "delete") {
      setModal(false);
      getAd();
    }
  };

  let accept = async (e) => {
    const res = await defaultAxios.post("/ads/accept", {
      _id: clickData._id,
      type: clickData.status,
    });
    console.log(res.data);
    console.log(clickData);
    if (res.data === "success") {
      console.log(clickData);
      setClickData({ ...clickData, ["status"]: "true" });
      getAd();
    }
  };

  useEffect(() => {
    getAd();
  }, []);

  return (
    <>
      <CardBody>
        <div style={{ width: "100%", height: "50%" }}>
          <span className="reportedlist" style={{fontFamily:"NanumSquare_acR",fontSize:"25px",fontWeight:"bold"}} >문의 목록</span>
          <Row className="header">
            <Col style={{ marginLeft: "10%",fontFamily:"NanumSquare_acR",fontSize:"20px"  }}>문의 타입 </Col>
            <Col style={{ marginLeft: "2%",fontFamily:"NanumSquare_acR",fontSize:"20px"  }}> 제목 </Col>
            <Col style={{ marginLeft: "1%",fontFamily:"NanumSquare_acR",fontSize:"20px"  }}> 작성자 </Col>
          </Row>
          <div>
            
            {requestList.map((data, i) => {
              return (
                <>
                
                  <Row
                    key={i}
                    className="rowbutton"
                    onClick={(e) => fadetoggle(data, i)}
                  >
                    
                    <Col style={{ marginLeft: "10%" ,fontSize:"20px"}}>
                      {data.type === "Ad" ? "광고" : "기타"}
                    </Col>
                    <Col style={{ marginLeft: "2%" ,fontSize:"20px" }}>{data.title}</Col>
                    <Col style={{ marginLeft: "2%" ,fontSize:"20px" }}>{data.name}</Col>
                  </Row>
                  <Row
                    style={{
                      marginLeft: "7%",
                      marginRight: "50%",
                      marginBottom:"2%"
                    }}
                  
                  >
                    {clickData.num === i ? (
                      
                      <Fade   style={{ display:"flex" }} in={fadeIn}>

                          {imgBase64 === "" ? (
                            
                            <Col >
                             <div  >이미지</div>
                              <img
                                src={ProfileNoImage}
                                alt="profile img"
                                height="100"
                                width="100"
                                style={{ borderRadius: "10px" }}
                              />
                              
                            </Col>
                          ) : (
                            <Col >
                             <div style={{marginBottom:"30%",marginLeft:"30%",fontFamily:"NanumSquare_acR",fontWeight:"bold"}}>이미지</div>
                              <img
                                src={imgBase64}
                                alt="profile img"
                                height="100"
                                width="130"
                                style={{ borderRadius: "10px", float: "left" }}
                              />{" "}
                            </Col>
                          )}
                          
                          <Col style={{marginLeft:"30%"}}>
                            <div style={{width:"50px",marginBottom:"80px",marginLeft:"10%",fontFamily:"NanumSquare_acR",fontWeight:"bold"}}>내용</div>
                            <div style={{width:"150px",textAlign:"left"}}>{clickData.contents}</div>
                          </Col>
                         
                          <Col  style={{marginLeft:"20%"}}>
                             <div style={{marginBottom:"80px",width:"50px" ,marginLeft:"25%",fontFamily:"NanumSquare_acR",fontWeight:"bold"}}>이메일</div>
                            <div>{clickData.email}</div>
                          </Col>
                          
                          <Col  style={{marginLeft:"20%"}}>
                            <div style={{width:"50px",marginBottom:"80px",fontFamily:"NanumSquare_acR",fontWeight:"bold",marginLeft:"10%"}}>상태</div>
                            {clickData.status === "false" ? <div style={{width:"50px",marginLeft:"13%"}}>보류</div> : <div style={{width:"100px"}}>승인완료</div>}
                          </Col>
                          <Col  style={{display:"flex",marginTop:"100px",marginLeft:"10%"}}>
                          {clickData.status === "false" ? (
                            <span  style={{marginRight:"2%"}}>
                            <Button style={{width:"70px",marginLeft:"20px"}}  color="warning" onClick={(e) => accept(e)}>
                              수락
                            </Button></span>
                          ) : (
                            ""
                          )}
                          <span>
                            {clickData.status === "true"?<Button style={{width:"70px",marginLeft:"40px"}} onClick={(e) => modaltoggle(e)}>거절</Button>:<Button style={{width:"70px"}} onClick={(e) => modaltoggle(e)}>거절</Button>}
                          </span>
                         </Col>
                      </Fade>
                    ) : (
                      ""
                    )}
                    
                  </Row>
                </>
              );
            })}
          </div>
        </div>
        <Modal isOpen={modal}>
          <ModalHeader toggle={(e) => modaltoggle(e)}>문의 거절</ModalHeader>
          <ModalBody>
            <div>{clickData.name}의 문의를 정말 거절하시겠습니까?</div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={(e) => reject(e)}>
              거절
            </Button>{" "}
            <Button color="warning" onClick={(e) => modaltoggle(e)}>
              취소
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </>
  );
};
export default AdminAd;
