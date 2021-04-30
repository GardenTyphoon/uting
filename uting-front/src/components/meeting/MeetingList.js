import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import woman from '../../img/woman.png'
import man from '../../img/man.png'
import MeetingRoom from '../../img/MeetingRoom.png'
import './MeetingList.css'
import { Container, Row, Col } from 'reactstrap';
let mannerColor;
function mannerCredit(avgManner) {
    if (avgManner === 4.5){
        mannerColor="#FF0000";
        return "A+";}
    else if (avgManner < 4.5 && avgManner >= 4.0){
        mannerColor="#FC92A4";
        return "A0";
    }
    else if (avgManner < 4.0 && avgManner >= 3.5){
         mannerColor="#FE5E16";
        return "B+";
    }
    else if (avgManner < 3.5 && avgManner >= 3.0){
        mannerColor="#FE9D72";
        return "B0";
    }
    else if (avgManner < 3.0 && avgManner >= 2.5){
        mannerColor="#97A1FF"; 
        return "C+";
    }
    else if (avgManner < 2.5 && avgManner >= 2.0){
        mannerColor="#020DEC";
        return "C0";
    }
    else if (avgManner < 2.0 && avgManner >= 1.5){
        mannerColor="#767171"; 
        return "D+";
    }
    else if (avgManner < 1.5 && avgManner >= 1.0){
        mannerColor="#151515";    
        return "D0";
    }
    else{
        mannerColor="#000000";
        return "F";
    }
}
export default function MeetingList({checkState}) {
    
    const history = useHistory();
    const [viewRoomList, setView] = useState([]);
    const attendRoomByID = (room, index) => {
        history.push({
            pathname: `/room`,
        });
    };
    
    useEffect(() => {
        axios
            .get('http://localhost:3001/meetings')
            .then(({ data }) => setView(data))
            .catch((err) => { });
    }, []);

    useEffect(()=>{
        axios
        .get('http://localhost:3001/meetings')
        .then(({ data }) => setView(data))
        .catch((err) => { });
    },[checkState])

    return (//tr map 한다음에 key넣어주기
        <div style={{width:"60%"}}>
            {viewRoomList.map((room, index) =>
                <Container className="MeetingRoom">
                    <Row style={{width:"100%"}}>
                        
                        <img src={MeetingRoom} style={{padding:"1%", width:"10%", borderRadius:"50%", marginRight:"5%"}}/>
                       
                        <Col xs="5" style={{display:"flex", alignItems:"center"}}>{room.title}</Col>
                        <Col xs="2">
                            <div style={{display:"flex", justifyContent:"center", color:mannerColor, marginTop:"15%"}}>
                                <div style={{marginRight:"7%"}}>{room.avgManner}</div>
                                <div >{mannerCredit(room.avgManner)}</div>
                            </div>
                            <div style={{display:"flex", justifyContent:"center", color:"#9A7D7D", fontSize:"small"}}>{room.avgAge}살</div>
                        </Col>
                        <Col xs="3">
                            <button className="joinBtn" onClick={() => attendRoomByID(room, index)}>참가</button>
                            <Col style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                <img style={{ width: "10%", height: "15%", marginRight:"8%"}} src={woman} />
                                <img style={{ width: "13%", height: "22%",  marginRight:"8%" }} src={man} />
                                <div> {room.numOfWoman}   |  {room.numOfMan} </div>
                                </Col>
                             
                            
                        </Col>
                    </Row>
                </Container>
            )}
        </div>

    )
}

