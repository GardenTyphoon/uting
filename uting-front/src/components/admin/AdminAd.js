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
  const [imgModal, setImgModal] = useState(false);

  const modaltoggle = (e) => {
    setModal(!modal);
  };

  const imgModaltoggle = (e) => {
    setImgModal(!imgModal);
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
          <span
            className="reportedlist"
            style={{
              fontFamily: "NanumSquare_acR",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            문의 목록
          </span>
          <Row className="header">
            <Col
              style={{
                fontFamily: "NanumSquare_acR",
                fontSize: "20px",
              }}
            >
              <div style={{ textAlign: "center" }}>문의타입</div>
            </Col>
            <Col
              style={{
                fontFamily: "NanumSquare_acR",
                fontSize: "20px",
              }}
            >
              <div style={{ textAlign: "center" }}>제목</div>
            </Col>
            <Col
              style={{
                fontFamily: "NanumSquare_acR",
                fontSize: "20px",
              }}
            >
              <div style={{ textAlign: "center" }}>작성자</div>
            </Col>
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
                    <Col style={{ fontSize: "20px" }}>
                      <div style={{ textAlign: "center" }}>
                        {data.type === "Ad" ? "광고" : "기타"}
                      </div>
                    </Col>
                    <Col style={{ fontSize: "20px" }}>
                      <div style={{ textAlign: "center" }}>{data.title}</div>
                    </Col>
                    <Col style={{ fontSize: "20px" }}>
                      <div style={{ textAlign: "center" }}>{data.name}</div>
                    </Col>
                  </Row>
                  <Row>
                    {clickData.num === i ? (
                      <Fade in={fadeIn}>
                        <hr />
                        <Row>
                          <Col xs="6">
                            <div>내용</div>
                            <div>{clickData.contents}</div>
                          </Col>
                          <Col>
                            <div>이메일</div>
                            <div>{clickData.email}</div>
                          </Col>
                          <Col>
                            <div>상태</div>
                            <div>
                              {clickData.status === "false"
                                ? "보류"
                                : "승인완료"}
                            </div>
                          </Col>
                        </Row>
                        <div style={{ float: "right", marginRight: "3%" }}>
                          <Button onClick={(e) => imgModaltoggle(e)}>
                            이미지보기
                          </Button>
                          {clickData.status === "false" ? (
                            <span>
                              <Button
                                color="warning"
                                onClick={(e) => accept(e)}
                              >
                                수락
                              </Button>
                            </span>
                          ) : (
                            ""
                          )}
                          <span>
                            <Button onClick={(e) => modaltoggle(e)}>
                              거절
                            </Button>
                          </span>
                        </div>
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
        <Modal isOpen={imgModal}>
          <ModalHeader toggle={(e) => imgModaltoggle(e)}>
            이미지 보기
          </ModalHeader>
          <ModalBody>
            {imgBase64 === "" ? (
              <>
                <div>이미지</div>
                <img
                  src={ProfileNoImage}
                  alt="profile img"
                  height="100%"
                  width="100%"
                  style={{ borderRadius: "10px", float: "left" }}
                />
              </>
            ) : (
              <>
                <div style={{ textAlign: "center" }}>이미지</div>
                <img
                  src={imgBase64}
                  alt="profile img"
                  height="100%"
                  width="100%"
                  style={{ borderRadius: "10px", float: "left" }}
                />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={(e) => imgModaltoggle(e)}>
              확인
            </Button>
          </ModalFooter>
        </Modal>
      </CardBody>
    </>
  );
};
export default AdminAd;
