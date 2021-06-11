import React, { useState, useEffect } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import styled from "styled-components";
import classnames from "classnames";
import Conversation from "./Conversation";
import GameRecom from "./GameRcom";
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
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("0");

  let isOpen = () => {
    setOpen(!open);
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab("1");
  }, []);

  return (
    <CardBody>
      mc봇에 대화추천 게임추천 데이터 CRUD할 예정
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            대화
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            게임
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Conversation tab={activeTab}></Conversation>
        </TabPane>
        <TabPane tabId="2">
          <GameRecom tab={activeTab}></GameRecom>
        </TabPane>
      </TabContent>
    </CardBody>
  );
};
export default AdminMc;
