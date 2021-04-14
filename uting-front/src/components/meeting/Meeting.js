import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const Meeting = () => {
    
  
    const [room, setRoom] = useState({
        title:'', //방제
        num:0,    // 전체 방인원수 나누기 2
        status:'대기'  // 참가버튼 누르면 미팅중
    })
    const onChangehandler = e => {
        const { name, value } = e.target;
        setRoom({
            ...room,
            [name]: value
        })
    };
    const makeRoom = async(e) => {
        e.preventDefault();
        await axios.post('http://localhost:3001/meetings',room);
    }

    return (
       <div>여기에 미팅방 생성 입력폼 만들거임</div>
       /* <React.Fragment>
            <input className="room-input" type='text' placeholder='방제목' onChange={onChangehandler} name='title' />
            <input type='number' min='1' max='4' placeholder='명수' onChange={onChangehandler} name='num'/>
            <button onClick={makeRoom}>방만들기</button>
        </React.Fragment>*/

    )
};
export default Meeting;

