import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import woman from '../../img/woman.png'
import man from '../../img/man.png'
import MeetingRoom from '../../img/MeetingRoom.png'
import './MeetingList.css'
import { Container, Row, Col, Tooltip, Modal, ModalFooter, ModalHeader, ModalBody, Button } from 'reactstrap';
import socketio from "socket.io-client";

import { useAppState } from '../../providers/AppStateProvider';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';
import { createGetAttendeeCallback, fetchMeeting, attendMeeting } from '../../utils/api';
import { ConsoleLogger } from 'amazon-chime-sdk-js';
let mannerColor;
function mannerCredit(avgManner) {
    if (avgManner === 4.5) {
        mannerColor = "#e96363"; //빨강
        return "A+";
    }
    else if (avgManner < 4.5 && avgManner >= 4.0) {
        mannerColor = "#fdc95d"; //주황
        return "A0";
    }
    else if (avgManner < 4.0 && avgManner >= 3.5) {
        mannerColor = "#f28e72"; //탁한분홍
        return "B+";
    }
    else if (avgManner < 3.5 && avgManner >= 3.0) {
        mannerColor = "#72c4bf"; //청록?
        return "B0";
    }
    else if (avgManner < 3.0 && avgManner >= 2.5) {
        mannerColor = "#6d9eca"; //바다색
        return "C+";
    }
    else if (avgManner < 2.5 && avgManner >= 2.0) {
        mannerColor = "#7668ac"; //보라색
        return "C0";
    }
    else if (avgManner < 2.0 && avgManner >= 1.5) {
        mannerColor = "#B29FFC"; //갈색
        return "D+";
    }
    else if (avgManner < 1.5 && avgManner >= 1.0) {
        mannerColor = "#444C57"; //먹색
        return "D0";
    }
    else {
        mannerColor = "#000000";
        return "F";
    }
}

function birthToAge(birth) {
    console.log(birth)
    let year = birth.slice(0, 4);
    return 2021 - Number(year) + 1;
}

export default function MeetingList({ checkState, groupSocketList, currentsocketId, filterRoomName, filtermanner, filterage, getorigin }) {

    const history = useHistory();
    const meetingManager = useMeetingManager();
    const { setAppMeetingInfo, region: appRegion, meetingId: appMeetingId } = useAppState();


    const [viewRoomList, setView] = useState([]);
    const [originList, setOriginList] = useState([])
    const [state, setState] = useState(false);
    const [toolTipId, settoolTipId] = useState("");

    const [groupMember, setGroupMember] = useState([]);
    const [flag, setFlag] = useState(false)
    const [roomObj, setRoomObj] = useState({})
    const [prevFilter, setPrevFilter] = useState("")
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [getalert, setGetalert] = useState({ "flag": false, "message": "" })

    let sessionUser = sessionStorage.getItem("nickname");

    let toggleAlert =(e)=>{
        setGetalert({...getalert,"flag":!getalert.flag})
      }

    const updateNewParticipants_to_OriginParticipants = async (meetingRoomParticipants) => {

        const socket = socketio.connect("http://localhost:3001");
        let data = {
            preMember: meetingRoomParticipants
        };
        const res = await axios.post(
            "http://localhost:3001/users/preMemSocketid",
            data
        );
        console.log(res);
        let arr = []
        for (let i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].socketid)
        }

        socket.emit("newParticipants", { socketIdList: arr });
    }
    const canAttend = async (room) => {
        console.log("나 들어갈수있엉?")
        let myGroupWoman = 0;
        let myGroupMan = 0;
        let groupMembersInfo = []
        console.log(groupMember)
        for (let i = 0; i < groupMember.length; i++) {
            let userInfo = await axios.post('http://localhost:3001/users/userInfo', { "userId": groupMember[i] });
            console.log(userInfo.data)
            groupMembersInfo.push({
                "nickname": userInfo.data.nickname,
                "introduce": userInfo.data.introduce,
                "mannerCredit": userInfo.data.mannerCredit,
                "age": birthToAge(userInfo.data.birth),
                "ucoin": userInfo.data.ucoin,
                "gender": userInfo.data.gender,
                "birth" : userInfo.data.birth,
            });
            if (groupMembersInfo.gender === "woman") { myGroupWoman++; }
            else { myGroupMan++; }
        }
        console.log(groupMembersInfo)
        if (room.numOfMan + myGroupMan <= room.maxNum && room.numOfWoman + myGroupWoman <= room.maxNum) {
            console.log("웅")
            attendRoomByID(room, groupMembersInfo);
        }
        else {
            setGetalert({ "flag": true, "message": "정해진 인원수가 맞지 않아 입장이 불가합니다." })
        }
    }
    const attendRoomByID = async (room, groupMembersInfo) => {

        console.log(groupMember)
        setRoomObj(room)

        // setFlag(true)
        const userNum = room.users.length;
        let sumManner = room.avgManner * userNum;
        let sumAge = room.avgAge * userNum;

        let numOfWoman = 0;
        let numOfMan = 0;


        let groupMembersSocketId = []

        for (let i = 0; i < groupMembersInfo.length; i++) {

            if (groupMembersInfo[i].nickname != sessionUser) {
                groupMembersSocketId.push(groupMembersInfo[i].socketid);
            }
            sumManner += groupMembersInfo[i].mannerCredit;
            
            sumAge += birthToAge(groupMembersInfo[i].birth);
            if (groupMembersInfo[i].gender === "woman") numOfWoman += 1;
            else numOfMan += 1;
        }
        let coinCheck = true;
        for (let i = 0; i < groupMembersInfo[i].length; i++) {
            if (groupMembersInfo[i].ucoin < 0) {
                coinCheck = false
            }
        }
        if (coinCheck === true) {
            // sumManner += avgManner;
            // sumAge += avgAge;
            //

            let new_numOfMan = numOfMan + room.numOfMan;
            let new_numOfWoman = numOfWoman + room.numOfWoman;

            const avgManner = sumManner / (new_numOfMan + new_numOfWoman);
            const avgAge = parseInt(sumAge / (new_numOfMan + new_numOfWoman));

            // let new_status = "대기";
            // console.log(new_numOfMan, new_numOfWoman, room.maxNum * 2)
            // if ((new_numOfMan + new_numOfWoman - room.maxNum * 2) === 0) {
            //     console.log("아니 여기 왜 안들어가?")
            //     new_status = "진행";
            // }
            let data = {
                title: room.title,
                maxNum: Number(room.maxNum),
                status: "진행",
                avgManner: avgManner.toFixed(3),
                avgAge: avgAge,
                numOfWoman: new_numOfWoman,
                numOfMan: new_numOfMan,
                groupmember: groupMembersInfo,
                session: sessionUser,
                flag: 1,
            }
            //console.log(typeof data.groupmember)
            //const response = await axios.post("http://localhost:3001/meetings/newmembers", data)
            let meetingRoomParticipants = [];
            room.users.map((per) => {
                meetingRoomParticipants.push(per.nickname);

            })
            updateNewParticipants_to_OriginParticipants(meetingRoomParticipants); //현재 들어가려는 미팅룸에 있는 애들이 가지고 있는 로컬 participantsSocketId를 업데이트

            try {
                const { JoinInfo } = await fetchMeeting(data);
                await meetingManager.join({
                    meetingInfo: JoinInfo.Meeting,
                    attendeeInfo: JoinInfo.Attendee
                });

                setAppMeetingInfo(room.title, sessionUser, 'ap-northeast-2');
                if (room.title !== undefined) {
                    const socket = socketio.connect('http://localhost:3001');
                    console.log("groupMembersSocketId", groupMembersSocketId)
                    socket.emit('makeMeetingRoomMsg', { "groupMembersSocketId": groupMembersSocketId, "roomtitle": room.title })
                }
                await meetingManager.start();

                history.push(`/room/${room.title}`);
            } catch (error) {
                console.log(error);
            }
        }
        else if (coinCheck === false) {
            alert("그룹원 중에 유코인이 부족한 사람이 있어 비팅방 참가가 불가합니다. 유코인을 충전하세요.")
        }


    };




    let saveMeetingUsers = async (e) => {
        console.log("saveMeetingUsers", roomObj)
        let data = {
            member: groupMember,
            room: roomObj
        }
        console.log("saveMeetingUsers", data)
        const res = await axios.post("http://localhost:3001/meetings/savemember", data)
        console.log(res)

    }

    useEffect(() => {
        if (groupMember.length !== 0 && roomObj.lenght !== undefined) {
            saveMeetingUsers()
        }
    }, [groupMember])
    // useEffect(() => {

    //     groupSocketList.push(currentsocketId.id)
    //    const socket = socketio.connect('http://localhost:3001');
    //     socket.emit('entermessage', { "socketidList": groupSocketList, "roomid": "roomid~!", "_id":roomObj._id })
    //         //socket.emit('hostentermessage',{"socketid":currentsocketId.id})

    // }, [flag])

    const getGroupInfo = async (e) => {

        let sessionObject = { sessionUser: sessionUser };
        const res = await axios.post(
            "http://localhost:3001/groups/info",
            sessionObject
        );
        console.log(typeof (res.data.member));
        let onlyMe = [sessionUser];
        if (res.data === "no") setGroupMember(onlyMe);
        else setGroupMember(res.data.member);
        //setGroupMember(res.data.member);
    };

    const toggleToolTipId = (title) => {

        if (state === true) {
            setState(false);
            settoolTipId("");
        }
        else {

            setState(true);
            settoolTipId(title);
        }
    }
    useEffect(() => {
        getMeetings()
        getGroupInfo()
    }, []);


    useEffect(() => {
        if (checkState === true) {
            getMeetings()
        }
    }, [checkState])


    let getMeetings = async () => {
        await axios
            .get('http://localhost:3001/meetings')
            .then(({ data }) => {
                setView(data)
                setOriginList(data)
            })
            .catch((err) => { });

    }

    useEffect(() => {
        const filteredName = originList.filter((data) => {
            return data.title.toLowerCase().includes(filterRoomName)
        });
        setView(filteredName)
    }, [filterRoomName])

    useEffect(() => {
        let filtered = [];

        originList.map((data) => {
            if (data.avgManner <= filtermanner.first && data.avgManner >= filtermanner.last) {
                filtered.push(data)
            }
        })
        setView(filtered)
    }, [filtermanner])

    useEffect(() => {
        let filtered = [];

        originList.map((data) => {
            if (data.avgAge <= filterage.first && data.avgAge >= filterage.last) {
                filtered.push(data)
            }
        })
        setView(filtered)

    }, [filterage])

    useEffect(() => {

        //setView(originList)
        getMeetings();

    }, [getorigin])

    return (//tr map 한다음에 key넣어주기
        <div className="RoomListContainer" >
            {viewRoomList.map((room, index) =>

                <div style={{ marginRight: "25px" }}>
                    <Container className="MeetingRoom">
                        <Row style={{ width: "100%" }}>

                            <img src={MeetingRoom}
                                className="MeetingRoomImg"
                                style={{ borderColor: mannerColor }}
                                id={"Tooltip-" + room._id.substr(0, 10)}
                                onMouseOver={(e) => toggleToolTipId(room._id.substr(0, 10))}
                                onMouseOut={(e) => toggleToolTipId(room._id.substr(0, 10))}
                            />



                            <Col xs="5" style={{ display: "flex", alignItems: "center" }}>{room.title}</Col>
                            <Col xs="2">
                                <div style={{ display: "flex", justifyContent: "center", color: mannerColor, marginTop: "15%" }}>
                                    <div style={{ marginRight: "7%", fontWeight: "bold" }}>{room.avgManner !== null ? room.avgManner : ""}</div>
                                    <div style={{ fontWeight: "bold" }}>{mannerCredit(room.avgManner)}</div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "center", color: "#9A7D7D", fontSize: "small", fontWeight: "bold" }}>{room.avgAge}살</div>
                            </Col>
                            <Col xs="3">
                                <button className="joinBtn" onClick={() => canAttend(room)}>참가</button>
                                <Col style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <img style={{ width: "10%", height: "15%", marginRight: "8%" }} src={woman} />
                                    <img style={{ width: "13%", height: "22%", marginRight: "8%" }} src={man} />
                                    <div> {room.numOfWoman}   |  {room.numOfMan} </div>
                                </Col>


                            </Col>
                        </Row>

                    </Container>

                    <Tooltip
                        placement="bottom"
                        isOpen={toolTipId === room._id.substr(0, 10) && state === true}
                        target={"Tooltip-" + room._id.substr(0, 10)}
                        toggle={() => setTooltipOpen(!tooltipOpen)}
                        style={{ backgroundColor: "#DEEFFF", fontFamily: "NanumSquare_acR", color: "black", padding: "10px" }}
                    >

                        {room.users.map(user =>

                            <div>{user.nickname}  {mannerCredit(user.mannerCredit)}  {user.age}살 <br></br></div>)}
                    </Tooltip>




                </div>
            )}
            <Modal isOpen={getalert.flag} >
                <ModalHeader>
                    U-TING 메시지
                </ModalHeader>
                <ModalBody>
                    <div>{getalert.message}</div>

                </ModalBody>
                <ModalFooter>
                    <Button color="warning" onClick={(e) => toggleAlert(e)}>확인</Button>
                </ModalFooter>
            </Modal>
        </div>

    )
}