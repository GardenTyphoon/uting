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
    const [requestList,setRequestList]=useState([]);

    let isOpen = () => {
        setOpen(!open);
      };

    let getAd = async(e)=>{
      await axios
      .get('http://localhost:3001/ads/')
      .then(({ data }) => {
        setRequestList(data)
      })
      .catch((err) => { });
    }
      
    useEffect(()=>{
      if(open===true){
        getAd()
      }
    },[open])
      
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
        {requestList.map((data,i)=>{
          return(
            <div>{data.contents}{data.type}{data.name}{data.email}{data.file}{data.contents}</div>
          )
        })}

       
      </CardBody>
    </Collapse>
  </Card>
  );
};
export default AdminAd;
