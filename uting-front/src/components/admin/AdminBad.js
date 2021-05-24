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
    const [choice,setChoice]=useState({})
    const [modal, setModal] = useState(false);
    const [content,setContent]=useState({})

    const toggle = (e) => {
      if(e==="hell"){
        let data={
          "type":"hell",
          "modalcontent":"정말로 신고처리 하시겠습니까?",
          "buttoncontent":"신고처리"
        }
        setContent(data)
      }
      else if(e==="pass"){
        let data={
          "type":"pass",
          "modalcontent":"정말로 봐주시겠습니까?",
          "buttoncontent":"봐주기"
        }
        setContent(data)
      }
      setModal(!modal)
    };
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

      let goHell = async(e)=>{
        console.log("나쁜사람",choice)
        let data={
          nickname:choice.target
        }
        const res = await axios.post("http://localhost:3001/users/report",data)
        if(res.data==="success"){

          const response = await axios.post("http://localhost:3001/reports/delete",{"_id":choice._id})
          if(response.data==="success"){
            alert(choice.target+"님을 완전히 신고처리 하였습니다.")
            getReported()
          }
        }
        setModal(false)
      }

      let pass = async(e)=>{
        console.log("봐주기",choice)
        const response = await axios.post("http://localhost:3001/reports/delete",{"_id":choice._id})
          if(response.data==="success"){
            alert(choice.target+"님을 한 번 봐주었습니다..")
            getReported()
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
        <div style={{width:"100%",height:"100%"}}>
          <span>신고자 목록</span>
          <Button color="danger" onClick={(e)=>toggle("hell")}>악한사람</Button><Button color="warning" onClick={(e)=>toggle("pass")}>봐주기</Button>
          <div><span> 신고된 사람 </span><span> 신고 사유 </span><span> 신고한 사람 </span></div>
          <div>{reportedList.map((per,i)=>{
            return(<div onClick={(e)=>setChoice(per)}>{per.target}-{per.content}-{per.requester}</div>)
          })}</div>
        </div>

      </CardBody>

      <Modal isOpen={modal}>
        <ModalBody>
          <div>{choice.requester}님이 {choice.target}님을"{choice.content}" 이유로 신고하였습니다.</div>
          <div>{choice.target}님을 {content.modalcontent}</div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e)=>content.type==="hell"?goHell(e):content.type==="pass"?pass(e):""}>{content.buttoncontent}</Button>{' '}
          <Button color="secondary" onClick={(e)=>toggle(e)}>취소</Button>
        </ModalFooter>
      </Modal>
    </Collapse>
  </Card>
  );
};
export default AdminBad;
