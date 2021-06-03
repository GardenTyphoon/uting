import React, { useState,useEffect } from 'react';
import { Route, Link,Switch,Router } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import './Admin.css'
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
    import introLog from '../../img/배경없는유팅로고.png'

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
    const [choice,setChoice]=useState({})
    const [modal, setModal] = useState(false);
    const [getalert,setGetalert]=useState({"flag":false,"message":""})
  
    const toggle = (e) => {
      if(e==="none"){
        setChoice({})
      }
      else{
        setChoice(e)
      }
      
      setModal(!modal)
    };
    let isOpen = () => {
        setOpen(!open);
      };

      let getReported =async(e)=>{
        await axios
            .get('http://localhost:3001/reports/')
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

      let goHell = async(e)=>{
        console.log("나쁜사람",choice)
        let data={
          nickname:choice.target
        }
        const res = await axios.post("http://localhost:3001/users/report",data)
        console.log(res)
        if(res.data==="success"){

          const response = await axios.post("http://localhost:3001/reports/delete",{"_id":choice._id})
          if(response.data==="success"){
            setGetalert({"flag":true,"message":choice.target+"님을 완전히 신고처리 하였습니다."})
            getReported()

            setTimeout(()=>{
              setGetalert({"flag":false,"message":""})
            },1500)
          }
        }
        setModal(false)
      }

      let pass = async(e)=>{
        console.log("봐주기",choice)
        const response = await axios.post("http://localhost:3001/reports/delete",{"_id":choice._id})
          if(response.data==="success"){
            setGetalert({"flag":true,"message":choice.target+"님을 한 번 봐주었습니다.."})
            getReported()
            setTimeout(()=>{
              setGetalert({"flag":false,"message":""})
            },1500)
          }
        setModal(false)

      }
    
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
        <div style={{width:"100%",height:"50%"}}>
          <span className="reportedlist">신고자 목록</span>
          <Row className="header">
            <Col style={{marginLeft:"10%"}}> 신고된 사람 </Col>
            <Col style={{marginLeft:"2%"}}> 신고 사유 </Col>
            <Col style={{marginLeft:"1%"}}> 신고한 사람 </Col>
          </Row>
          <div>{reportedList.map((per,i)=>{
            return(<Row className="rowbutton" onClick={(e)=>toggle(per)}>
                      <Col style={{marginLeft:"10%"}}>{per.target}</Col>
                      <Col >{per.content}</Col>
                      <Col style={{marginLeft:"2%"}}>{per.requester}</Col>              
                    </Row>)
          })}</div>
        </div>

      </CardBody>


      <Modal isOpen={modal} >
        <ModalHeader toggle={(e)=>toggle("none")}>
          신고처리 및 봐주기
        </ModalHeader>
        <ModalBody>
          <div>[{choice.target}]님이 <span style={{color:'red'}}>{choice.content}</span> 이유로 신고되었습니다.</div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={(e)=>goHell(e)}>신고처리</Button>{' '}
          <Button color="warning" onClick={(e)=>pass(e)}>봐주기</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={getalert.flag} >
        <ModalHeader style={{height:"70px",textAlign:"center"}}>
          <img style={{width:"40px",height:"40px",marginLeft:"210px",marginBottom:"1000px"}} src={introLog}></img>
        </ModalHeader>
        <ModalBody style={{height:"90px"}}>
          <div style={{textAlign:"center",marginTop:"4%",marginBottom:"8%",fontFamily:"NanumSquare_acR",fontWeight:"bold",fontSize:"20px",height:"50px"}}>{getalert.message}</div>
          
        </ModalBody>
      </Modal>
    </Collapse>
  </Card>
  );
};
export default AdminBad;
