import React, { useState,useEffect } from 'react';
import { Route, Link,Switch,Router } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
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
    Row, } from 'reactstrap';


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
    let isOpen = () => {
        setOpen(!open);
      };
  return (
    <Card>
    <CardHeader>
      <FlexBox>
        {'MC봇 관리'}
        <RightButton>
          <Button onClick={(e) => isOpen()}>OPEN</Button>
        </RightButton>
      </FlexBox>
    </CardHeader>
    <Collapse isOpen={open}>
      <CardBody>
        mc봇에 대화추천 게임추천 데이터 CRUD할 예정
      </CardBody>
    </Collapse>
  </Card>
  );
};
export default AdminMc;
