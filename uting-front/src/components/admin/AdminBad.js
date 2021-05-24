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
    const [reportedList,setReportedList]=useState([])
    let isOpen = () => {
        setOpen(!open);
      };

      let getReported =async(e)=>{
        await axios
            .get('http://localhost:3001/reports')
            .then(({ data }) => {
              setReportedList(data)
            })
            .catch((err) => { });
      }

      useEffect(()=>{
        if(open===true){
          getReported()
        }
      },[open])
    
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
        <div style={{width:"100%",height:"100%"}}>
          <span>신고자 목록</span>
          <div>{reportedList.map((per,i)=>{
            return(<div>{per.requester}-{per.target}-{per.content}</div>)
          })}</div>
        </div>

      </CardBody>
    </Collapse>
  </Card>
  );
};
export default AdminBad;
