import React, { Component } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';

export default function RoomList() {
    const [room, setRoom] = useState({
        title:'',
        num:0,
        status:'대기'
    })
    const [viewRoomList,setView]=useState([]);
    const getTitle = e => {
        const { name, value } = e.target;
        setRoom({
            ...room,
            [name]: value
        })
    };
    const getNum = e => {
        const { name, value } = e.target;
        setRoom({
            ...room,
            [name]: value
        })
    };
    const attendRoomByID=(room,index)=>{
       const newroom={title:room.title,num:room.num,status:'미팅중'};
        setView({...viewRoomList.slice(0,index),
       newroom,
       ...viewRoomList.slice(index+1)
    }
       )
       console.log(viewRoomList);
    };
    return (//tr map 한다음에 key넣어주기
        <React.Fragment>
            <input className="room-input" type='text' placeholder='방제목' onChange={getTitle} name='title' />
            <input type='number' min='1' max='4' placeholder='명수' onChange={getNum} name='num'/>
            <button onClick={()=>{
                setView(viewRoomList.concat({...room}));
                
            }}>방만들기</button>
            <h2>방리스트</h2>
            <table border="1">
	<th>남/여</th>
	<th>방제목</th>
    <th>상태</th>
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

