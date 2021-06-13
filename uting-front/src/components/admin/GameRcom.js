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

const GameRecom = ({check}) => {
  const [gameList, setGameList] = useState([]);

  let getGameList = async (e) => {
    let data = {
      type: "game",
    };
    const res = await defaultAxios.post("/mcs/list", data);
    setGameList(res.data);
  };

  useEffect(()=>{
    getGameList()
  },[check])


  const deleteData = async(e) => {
    console.log(e)
  }

  return (
    <div>
      <div className="addbtn" >게임 주제</div>
      <div>
        {gameList.map((data, i) => {

          return <div onClick={(e)=>deleteData(data)} className="datalist"><span className="datanum">{i+1}.</span><span>{data}</span></div>;

        })}
      </div>
    </div>
  );
};
export default GameRecom;
