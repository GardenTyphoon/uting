import React, { useState,useEffect } from 'react';
import { Route, Link,Switch,Router } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import classnames from 'classnames';
import Conversation from './Conversation'
import GameRecom from './GameRcom'
import ProfileNoImage from "../../img/ProfileNoImage.jpg";
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
    Fade,
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
    const [fadeIn, setFadeIn] = useState(false);
    const [clickData,setClickData]=useState({})
    const [imgBase64, setImgBase64] = useState("");
    const fadetoggle = (e,i) => {
      setFadeIn(!fadeIn)
      let data={
        num:i,
        email:e.email,
        file:e.file,
        contents:e.contents
      }
      setClickData(data)
      let staticpath = "http://localhost:3001";
      setImgBase64(staticpath + e.file);
    };
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
    /*
                      <Col >{data.name}</Col>
                      <Col style={{marginLeft:"2%"}}>{data.email}</Col>   
                      <Col style={{marginLeft:"2%"}}>{data.file}</Col> */
      
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

      <div style={{width:"100%",height:"50%"}}>
          <span className="reportedlist">문의 목록</span>
          <Row className="header">
            <Col style={{marginLeft:"10%"}}>문의 타입 </Col>
            <Col style={{marginLeft:"2%"}}> 제목 </Col>
            <Col style={{marginLeft:"1%"}}> 작성자 </Col>
          </Row>
          <div>{requestList.map((data,i)=>{
            return(<><Row key={i} className="rowbutton" onClick={(e)=>fadetoggle(data,i)} >
                      <Col style={{marginLeft:"10%"}}>{data.type==='Ad'?"광고":"기타"}</Col>
                      <Col style={{marginLeft:"2%"}}>{data.title}</Col>  
                      <Col style={{marginLeft:"2%"}}>{data.name}</Col>    
                             
                    </Row>
                    <Row style={{marginLeft:"10%",marginRight:"50%",marginTop:"1%",marginBottom:"1%"}}>
                    {clickData.num===i?
                      <Fade  in={fadeIn}>
                        <div style={{float:"left"}}>
                        {imgBase64 === "" ? (
                        <Col><img src={ProfileNoImage} alt="profile img" height="100" width="100" style={{ borderRadius: "10px"}} /></Col>
                         ) : (
                        <Col><img src={imgBase64} alt="profile img" height="100" width="130" style={{ borderRadius: "10px",float:"left" }} /> </Col>)}
                        <Col style={{marginLeft:"20%",marginRight:"1000px"}}>{clickData.contents}</Col>
                        <Col style={{marginLeft:"40%",marginRight:"1000px"}}>{clickData.email}</Col>
                        </div>
                      </Fade>:""}
                    </Row>
                    
                    
                  </>
                  )
          })}</div>
          
        </div>


       
      </CardBody>
    </Collapse>
  </Card>
  );
};
export default AdminAd;
