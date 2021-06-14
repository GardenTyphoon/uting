import React, { useState, useEffect } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import styled from "styled-components";
import classnames from "classnames";
import Conversation from "./Conversation";
import GameRecom from "./GameRcom";
import jwtAxios from "../../utils/jwtAxios";
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
} from "reactstrap";

const RightButton = styled.div`
  position: relative;
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
`;

const FlexBox = styled.div`
  display: flex;
`;

const AdminMc = () => {
  const [state, setState] = useState({ type: "1", content: "" });
  const [checkconv, setCheckconv] = useState(false);
  const [checkgame, setCheckgame] = useState(false);
  const onChangehandler = (e) => {
    let { name, value } = e.target;
    if (name === "type") {
      setState({ ...state, type: value });
    } else if (name === "content") {
      setState({ ...state, content: value });
    }
  };

  const submit = async (e) => {
    console.log(state);
    let data = {
      type: state.type,
      content: state.content,
    };
    const res = await jwtAxios.post("/mcs/", data);

    if (res.data === "저장완료") {
      if (state.type === "game") {
        setCheckgame(!checkgame);
      } else if (state.type === "conversation") {
        setCheckconv(!checkconv);
      }
      setState({ type: "1", content: "" });
      document.getElementById("type").value = "1";
      document.getElementById("content").value = "";
    }
  };

  return (
    <CardBody>
      <Row>
        <Col>
          <Conversation check={checkconv}></Conversation>
        </Col>
        <Col>
          {" "}
          <GameRecom check={checkgame}></GameRecom>
        </Col>
        <Col>
          <Input id="type" name="type" type="select" onChange={onChangehandler}>
            <option value="1">옵션을 선택하시오.</option>
            <option value="conversation">대화</option>
            <option value="game">게임</option>
          </Input>
          <Input
            id="content"
            name="content"
            type="textarea"
            placeholder={
              state.type === "conversation"
                ? "대화 주제를 기입하시오."
                : state.type === "game"
                ? "게임 주제를 기입하시오"
                : ""
            }
            onChange={onChangehandler}
          ></Input>
          <Button id="btn" onClick={(e) => submit(e)} color="info">
            추가
          </Button>
        </Col>
      </Row>
    </CardBody>
  );
};
export default AdminMc;
