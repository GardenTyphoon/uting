import React, { useState,useEffect } from 'react';
import { Route, Link,Switch,Router } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import classnames from 'classnames';
import Conversation from './Conversation'
import GameRecom from './GameRcom'
import {Button,
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
    Row,TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
  } from 'reactstrap';


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
    const [activeTab, setActiveTab] = useState('1');

    let isOpen = () => {
        setOpen(!open);
      };
      
    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }
      
  return (
    <Card>
    <CardHeader>
      <FlexBox>
        {'광고 및 문의사항 관리'}
        <RightButton>
          <Button onClick={(e) => isOpen()}>OPEN</Button>
        </RightButton>
      </FlexBox>
    </CardHeader>
    <Collapse isOpen={open}>
      <CardBody>
       
      </CardBody>
    </Collapse>
  </Card>
  );
};
export default AdminAd;
