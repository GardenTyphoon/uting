import React,{useEffect, useState} from "react";
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'


const Room = () => {


  return (
    <div style={{ backgroundColor: "#ffe4e1", width: "100vw", height: "100vh", padding: "2%" }}>
      
      <McBot></McBot>
    </div>
  );
};

export default Room;
