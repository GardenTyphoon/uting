import axios from 'axios';
import React from 'react';
import { useState } from 'react';

export default function Meeting() {
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
        const res = await axios.post('http://localhost:3001/meetings',room);
    }
    return (
        <React.Fragment>
            <input className="room-input" type='text' placeholder='방제목' onChange={onChangehandler} name='title' />
            <input type='number' min='1' max='4' placeholder='명수' onChange={onChangehandler} name='num'/>
            <button onClick={makeRoom}>방만들기</button>
        </React.Fragment>
    )
}

