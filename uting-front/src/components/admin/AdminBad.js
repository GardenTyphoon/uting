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

const AdminBad = () => {
    const [open, setOpen] = useState(false);
    let isOpen = () => {
        setOpen(!open);
      };
  return (
    <Card>
    <CardHeader>
      <FlexBox>
        {'신고자 관리'}
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
export default AdminBad;
