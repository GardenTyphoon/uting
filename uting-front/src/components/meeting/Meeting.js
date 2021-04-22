import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';

const Meeting = () => {
    const myGroupId="607fdec1a1037a1b1c668488"; //내가 속한 그룹의 아이디 가져오는 거 구현해야 함
    const [room, setRoom] = useState({
        title:"", //방제
        num:0,    // 전체 방인원수 나누기 2
        status:'대기',  // 참가버튼 누르면 미팅중
        roomImg : "",
        avgManner:"",
        avgAge:"",
        users:"",
        numOfWoman:"",
        numOfMan:""
    })
    const onChangehandler = e => {
        const { name, value } = e.target;
        setRoom({
            ...room,
            [name]: value
        })
    };
    const makeRoom = async(e) => {
        //e.preventDefault();
        let GroupId = { "groupId": myGroupId };
        console.log("hihi");
        const res = await axios.post('http://localhost:3001/groups/getMyGroup', GroupId);
        console.log(res.data);
        await axios.post('http://localhost:3001/meetings',room);
    }
    return (
       <div>
           <input className="room-input" type='text' placeholder='방제목' onChange={onChangehandler} name='title' />
           <input type='number' min='1' max='4' placeholder='명수' onChange={onChangehandler} name='num'/>
           <button onClick={makeRoom}>방만들기</button>
       </div>
       
    )
};
export default Meeting;

