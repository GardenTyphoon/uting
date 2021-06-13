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

const RightButton = styled.div`
  position: relative;
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
`;

const FlexBox = styled.div`
  display: flex;
`;

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
          <span className="reportedlist">문의 목록</span>
          <Row className="header">
            <Col style={{ marginLeft: "10%" }}>문의 타입 </Col>
            <Col style={{ marginLeft: "2%" }}> 제목 </Col>
            <Col style={{ marginLeft: "1%" }}> 작성자 </Col>
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
                    <Col style={{ marginLeft: "10%" }}>
                      {data.type === "Ad" ? "광고" : "기타"}
                    </Col>
                    <Col style={{ marginLeft: "2%" }}>{data.title}</Col>
                    <Col style={{ marginLeft: "2%" }}>{data.name}</Col>
                  </Row>
                  <Row
                    style={{
                      marginLeft: "10%",
                      marginRight: "50%",
                      marginTop: "1%",
                      marginBottom: "1%",
                    }}
                  >
                    {clickData.num === i ? (
                      <Fade in={fadeIn}>
                        <div style={{ float: "left" }}>
                          {imgBase64 === "" ? (
                            <Col>
                              <img
                                src={ProfileNoImage}
                                alt="profile img"
                                height="100"
                                width="100"
                                style={{ borderRadius: "10px" }}
                              />
                            </Col>
                          ) : (
                            <Col>
                              <img
                                src={imgBase64}
                                alt="profile img"
                                height="100"
                                width="130"
                                style={{ borderRadius: "10px", float: "left" }}
                              />{" "}
                            </Col>
                          )}
                          <Col
                            style={{ marginLeft: "20%", marginRight: "1000px" }}
                          >
                            {clickData.contents}
                          </Col>
                          <Col
                            style={{ marginLeft: "30%", marginRight: "1000px" }}
                          >
                            {clickData.email}
                          </Col>
                          <Col
                            style={{ marginLeft: "50%", marginRight: "1000px" }}
                          >
                            {clickData.status === "false" ? "보류" : "승인완료"}
                          </Col>
                        </div>
                        <div>
                          {clickData.status === "false" ? (
                            <Button color="warning" onClick={(e) => accept(e)}>
                              수락
                            </Button>
                          ) : (
                            ""
                          )}
                          <Button onClick={(e) => modaltoggle(e)}>거절</Button>
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
      </CardBody>
    </>
  );
};
export default AdminAd;
