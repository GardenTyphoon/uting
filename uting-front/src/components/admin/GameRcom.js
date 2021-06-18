import React, { useState, useEffect } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import jwtAxios from "../../utils/jwtAxios";
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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

const GameRecom = ({ check }) => {
  const [gameList, setGameList] = useState([]);
  const [toggleDel, setToggleDel] = useState(false);
  const [delData, setDelData] = useState({ data: "", idx: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  var pageSize = 5;
  const handleClick = (e, index) => {
    setCurrentPage(index);
  };

  let getGameList = async (e) => {
    let data = {
      type: "game",
    };
    const res = await jwtAxios.post("/mcs/list", data);
    setGameList(res.data);

    setPagesCount(Math.ceil(res.data.length / pageSize));
  };

  useEffect(() => {
    getGameList();
  }, [check]);

  const deleteData = async (e) => {
    console.log(e);
    let data = {
      type: "game",
      data: delData.data,
    };
    const res = await jwtAxios.post("/mcs/delete", data);
    if (res.data === "delete") {
      getGameList();
      setDelData({ data: "", idx: "" });
    }
  };

  const toggleDelete = (e, i) => {
    setToggleDel(!toggleDel);
    setDelData({ data: e, idx: i });
  };

  return (
    <div>
      <div className="addbtn">게임 주제</div>
      {gameList
        .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
        .map((data, i) => (
          <div onClick={(e) => toggleDelete(data, i)} className="datalist">
            <span className="datanum">{currentPage * 5 + i + 1}.</span>
            <span>{data}</span>
            <span>
              {i === delData.idx ? (
                <button
                  onClick={(e) => deleteData(e)}
                  style={{ float: "right", marginRight: "5%" }}
                  className="delbtn"
                >
                  삭제
                </button>
              ) : (
                ""
              )}
            </span>
          </div>
        ))}
      <br></br>
      <div className="pagination-wrapper">
        <Pagination aria-label="Page navigation example">
          <PaginationItem disabled={currentPage <= 0}>
            <PaginationLink
              onClick={(e) => handleClick(e, currentPage - 1)}
              previous
              href="#"
            />
          </PaginationItem>

          {[...Array(pagesCount)].map((page, i) => (
            <PaginationItem active={i === currentPage} key={i}>
              <PaginationLink onClick={(e) => handleClick(e, i)} href="#">
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem disabled={currentPage >= pagesCount - 1}>
            <PaginationLink
              onClick={(e) => handleClick(e, currentPage + 1)}
              next
              href="#"
            />
          </PaginationItem>
        </Pagination>
      </div>
    </div>
  );
};
export default GameRecom;
