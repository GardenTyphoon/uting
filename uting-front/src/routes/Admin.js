import React,{useEffect, useState} from "react";
import { Route, Link,Switch,Router } from 'react-router-dom';
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge,Container,Row,Col} from 'reactstrap';
import axios from 'axios';
import AdminBad from '../components/admin/AdminBad';
import AdminMc from '../components/admin/AdminMc';
import AdminAd from '../components/admin/AdminAd';
const WhiteSpace = styled.div`
  margin: 10px;
`;

const Admin = () => {
  
  
  return (
    
     <Container>
      <Row name="main" id="main">
        <Col lg="12">
          <AdminMc></AdminMc>
        </Col>
      </Row>
      <WhiteSpace></WhiteSpace>
      <Row name="main" id="main">
        <Col lg="12">
          <AdminBad></AdminBad>
        </Col>
      </Row>

      <WhiteSpace></WhiteSpace>

      <Row name="main" id="main">
        <Col lg="12">
          <AdminAd></AdminAd>
        </Col>
      </Row>

      <WhiteSpace></WhiteSpace>
      </Container>
    
                    
  )
      
};

export default Admin;
