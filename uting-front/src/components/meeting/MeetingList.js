import React, { Component } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';

export default function MeetingList() {
    const [room, setRoom] = useState({
        title: '',
        num: 0,
        status: '대기'
    })
    const [viewRoomList, setView] = useState([]);
    const attendRoomByID = (room, index) => {
        const newroom = { title: room.title, num: room.num, status: '미팅중' };
        setView({
            ...viewRoomList.slice(0, index),
            newroom,
            ...viewRoomList.slice(index + 1)
        }
        )
        console.log(viewRoomList);
    };
    return (//tr map 한다음에 key넣어주기
        <React.Fragment>
            <h2>방리스트</h2>
            <table border="1">
                <th>남/여</th>
                <th>방제목</th>
                <th>상태</th>
                {viewRoomList.map((room, index) => {
                    if (room.status == '대기') {
                        <tr>
                            <td>{room.num}:{room.num}</td>
                            <td>{room.title}</td>
                            <td>{room.status}</td>
                            <td><button onClick={() => attendRoomByID(room, index)}>참가</button></td>
                        </tr>
                    }
                }
                )}
            </table>
        </React.Fragment>
    )
}

