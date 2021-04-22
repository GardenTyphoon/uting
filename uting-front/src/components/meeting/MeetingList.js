import React, { useState,useEffect } from 'react';
import axios from 'axios';
import woman from '../../img/woman.png'
import man from '../../img/man.png'
function mannerCredit(avgManner){
    if(avgManner === 4.5) return "A+";
    else if(avgManner<4.5 && avgManner >=4.0) return "A0";
    else if(avgManner<4.0 && avgManner >=3.5) return "B+";
    else if(avgManner<3.5 && avgManner >=3.0) return "B0";
    else if(avgManner<3.0 && avgManner >=2.5) return "C+";
    else if(avgManner<2.5 && avgManner >=2.0) return "C0";
    else if(avgManner<2.0 && avgManner >=1.5) return "D+";
    else if(avgManner<1.5 && avgManner >=1.0) return "D0";
    else return "F";
}
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
        <div>
            {viewRoomList.map((room,index)=>
                <div>
                    <div>{room.title}</div>
                    <div>{room.avgManner}</div>
                    
                    <div>{mannerCredit(room.avgManner)}</div>
                    <div>{room.avgAge}</div>
                    <img style={{ width: "15px", height: "20px" }}src={woman} />
                    <img style={{ width: "15px", height: "20px" }}src={man} />
                    <div>{room.numOfWoman} | {room.numOfMan}</div>
                    <button onClick={()=>attendRoomByID(room,index)}>참가</button>
                </div>
            )}
        </div>
        /*
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
        */
        
    )
}

