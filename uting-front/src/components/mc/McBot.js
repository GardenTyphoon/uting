import React, { useState, useEffect } from 'react';
import { Route, Link, Switch, Router } from 'react-router-dom';
import axios from 'axios';
import McBotImg from '../../img/mc봇.png';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const McBot = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = (e) => setDropdownOpen(prevState => !prevState);

  return (
    <div>


      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret style={{ width:"15%", backgroundColor: "transparent", border: "0px" }}>
          <img src={McBotImg} style={{ width: "80%" }} />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>게임 추천</DropdownItem>
          <DropdownItem>대화 추천</DropdownItem>
          <DropdownItem>음악 재생</DropdownItem>
          <DropdownItem>실시간 게임</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default McBot;
