import React, { useState,useEffect } from 'react';
import axios from 'axios';

export default function MeetingList() {
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

    useEffect(() => {
        axios
        .get('http://localhost:3001/meetings')
        .then(({data}) =>setView(data))
        .catch((err)=>{});
      },[]);
     
    return (//tr map 한다음에 key넣어주기
        <React.Fragment>
            <h2>방리스트</h2>
            <table border="1">
                <th>남/여</th>
                <th>방제목</th>
                <th>상태</th>
                <th>평균매너학점</th>
                <th>평균나이</th>
                {console.log(viewRoomList)}
                {viewRoomList.map((room,index)=>
                    <tr>
                        <td>{room.num}:{room.num}</td>
                        <td>{room.title}</td>
                        <td>{room.status}</td>
                        <td>{room.status==='대기'?
                    (<button onClick={()=>attendRoomByID(room,index)}>참가</button>):(<div>-</div>)}</td>
                    </tr>
                    )}
            </table>
        </React.Fragment>
        
    )
}

