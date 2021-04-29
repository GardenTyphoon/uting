import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';

function birthToAge(birth) {
    let year = birth.slice(0, 4);
    return 2021 - Number(year) + 1;
}
const Meeting = ({ checkFunc }) => {
    let sessionUser = sessionStorage.getItem("nickname");

    const [groupMembers, setGroupMembers] = useState("");
    const [toggleWarningMess, setToggleWarningMess] = useState(false);
    const [room, setRoom] = useState({
        title: "", //방제
        num: 0, //성별당 최대인원
        status: '대기',  // 참가버튼 누르면 미팅중
    })
    const onChangehandler = e => {

        const { name, value } = e.target;
        if (name === 'title') {
            setRoom({
                ...room,
                [name]: value
            })
        }
        else {
            if (name === 'num' && value >= groupMembers.data.length && value <= 4) {

                setRoom({
                    ...room,
                    [name]: value
                })
                setToggleWarningMess(false);
            }
            else {
                setToggleWarningMess(true);
            }
        }
    };
    const getMyGroupMember = async (e) => {
        let res = await axios.post('http://localhost:3001/groups/getMyGroupMember', { sessionUser: sessionUser });
        setGroupMembers(res);
    }
    useEffect(() => {
        getMyGroupMember();
    })
    const makeRoom = async (e) => {

        e.preventDefault();
        if (toggleWarningMess === false) {
            //내가 속한 그룹의 그룹원들 닉네임 받아오기
            setRoom({ ...room, ["users"]: groupMembers });
            //평균 나이, 평균 학점, 현재 남녀 수 구하기
            let avgManner = 0;
            let avgAge = 0;
            let nowOfWoman = 0;
            let nowOfMan = 0;
            for (let i = 0; i < groupMembers.data.length; i++) {
                let userInfo = await axios.post('http://localhost:3001/users/userInfo', { "userId": groupMembers.data[i] });

                avgManner += userInfo.data.mannerCredit;
                avgAge += birthToAge(userInfo.data.birth);
                if (userInfo.data.gender === "woman") {
                    nowOfWoman += 1;
                }
                else nowOfMan += 1;

            }
            avgManner /= groupMembers.data.length;
            avgAge /= groupMembers.data.length;
            avgAge = parseInt(avgAge);
            //방 생성

            let data = {
                title: room.title,
                maxNum: Number(room.num),
                status: room.status,
                users: room.users,
                avgManner: avgManner,
                avgAge: avgAge,
                numOfWoman: nowOfWoman,
                numOfMan: nowOfMan
            };
            console.log(data);
            await axios.post('http://localhost:3001/meetings', data);

            checkFunc(true)
        }
    }
    return (
        <div>
            <input className="room-input" type='text' placeholder='방제목' onChange={onChangehandler} name='title' />
            <input type='number' min='1' max='4' placeholder='명수' onChange={onChangehandler} name='num' />
            <button onClick={makeRoom}>방만들기</button>
            {toggleWarningMess === true ?
                <div style={{ marginTop: "10px", fontFamily: "NanumSquare_acR", color: "#FF6994", fontSize: "small" }}>*성별 당 인원수는 적어도 {groupMembers.data.length}명 이상, 4명 이하여야 합니다.</div>
                : ""}
        </div>

    )
};
export default Meeting;

