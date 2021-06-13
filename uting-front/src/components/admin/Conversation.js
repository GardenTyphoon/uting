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
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import "./Admin.css";

const Conversation = ({ check }) => {
  const [conversationList, setConversationList] = useState([]);
  const [toggleDel, setToggleDel] = useState(false);
  const [delData, setDelData] = useState({ data: "", idx: "" });
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);

  var pageSize = 5;
  const handleClick = (e, index) => {
    setCurrentPage(index);
  };

  let getConversationList = async (e) => {
    let data = {
      type: "conversation",
    };
    const res = await defaultAxios.post("/mcs/list", data);
    setConversationList(res.data);

    setPagesCount(Math.ceil(res.data.length / pageSize));
  };

  useEffect(() => {
    getConversationList();
  }, [check]);

  const deleteData = async (e) => {
    console.log("del");
    let data = {
      type: "conversation",
      data: delData.data,
    };
    const res = await defaultAxios.post("/mcs/delete", data);
    if (res.data === "delete") {
      getConversationList();
      setDelData({ data: "", idx: "" });
    }
  };

  const toggleDelete = (e, i) => {
    setToggleDel(!toggleDel);
    setDelData({ data: e, idx: i });
  };

  return (
    <div>
      <div className="addbtn">대화 주제</div>
      {conversationList
        .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
        .map((data, i) => (
          <div onClick={(e) => toggleDelete(data, i)} className="datalist">
            <span className="datanum">{(currentPage)*5+i+1}.</span>
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
export default Conversation;
