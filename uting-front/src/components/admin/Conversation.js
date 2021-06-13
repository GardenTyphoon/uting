import React, { useState, useEffect } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import defaultAxios from "../../utils/defaultAxios";
import styled from "styled-components";
import classnames from "classnames";
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
import './Admin.css'

const Conversation = ({check}) => {
  const [conversationList, setConversationList] = useState([]);

  let getConversationList = async (e) => {
    let data = {
      type: "conversation",
    };
    const res = await defaultAxios.post("/mcs/list", data);
    setConversationList(res.data);
  };

  useEffect(()=>{
    getConversationList()
  },[check])


  return (
    <div>
      <div className="addbtn" >대화 주제</div>
      <div>
        {conversationList.map((data, i) => {
          return <div className="datalist"><span className="datanum">{i+1}</span><span>{data}</span></div>;
        })}
      </div>
    </div>
  );
};
export default Conversation;
