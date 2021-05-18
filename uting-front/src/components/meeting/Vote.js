import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {useHistory } from "react-router";
import styled from 'styled-components';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Progress,Input } from 'reactstrap';
import axios from 'axios';
import socketio from "socket.io-client";
import "./Vote.css"
import { ToastContainer, toast } from "react-toastify";

const Vote = forwardRef(({participantsSocketIdList, participants},ref) => {

    const history = useHistory();
    

    const [toggleEndMeetingBtn, setToggleEndMeetingBtn] = useState(false);
    const [toggleManner,setToggleManner]=useState(false)
    const [startVote, setStartVote] = useState(false);
    const [numOfAgree, setNumOfAgree] = useState(0);
    const [numOfDisagree, setNumOfDisagree] = useState(0);
    const [isVote, setIsVote] = useState(false);
    const [flag, setFlag] = useState(false);
    const [myDeicision, setMyDecision] = useState("");
    const [copyParticipants,setCopyParticipants]=useState(participants);
    const [goManner,setGoManner] = useState({"name":"","manner":""})

    const onClickEndMeetingBtn = (e) => {
        console.log(participantsSocketIdList)
        setToggleEndMeetingBtn(!toggleEndMeetingBtn)
        
    }

    const onClickStartVoteBtn = async (e) => {
        
        setToggleEndMeetingBtn(!toggleEndMeetingBtn)
        setStartVote(true);
        setFlag(true);
    }

    const onClickAgree = (e) => {
        const socket = socketio.connect("http://localhost:3001");
        socket.emit("endMeetingAgree", { participantsSocketIdList, numOfAgree: numOfAgree + 1 });
        setNumOfAgree(numOfAgree + 1);
        setIsVote(!isVote);
        setMyDecision("찬성");
    }

    const onClickDisagree = (e) => {
        const socket = socketio.connect("http://localhost:3001");
        socket.emit("endMeetingDisagree", { participantsSocketIdList, numOfDisagree: numOfDisagree + 1 });
        setNumOfDisagree(numOfDisagree + 1);
        setIsVote(!isVote);
        setMyDecision("반대");
    }


    const emitStartVote = () => {
        const socket = socketio.connect("http://localhost:3001");
        socket.emit("startVote", { socketidList:participantsSocketIdList });
        console.log(participantsSocketIdList);
        console.log("emitvote")
    }

    useImperativeHandle(ref, () => ({
        onStartVote(){
            toast("미팅 종료를 위한 투표를 시작합니다!ㅠoㅠ")
            setStartVote(true);
        },
        onEndMeetingAgree(data){
            if(startVote===true){
            setNumOfAgree(data);
            }
        },
        onEndMeetingDisagree(data){
            if(startVote===true){
            setNumOfDisagree(data);
            }
        }
      }));



    function doneVote() {
        if (startVote === true && numOfAgree + numOfDisagree === participants.length) return true;
        else return false;
    }

    function conditionEndMeeting() {
        if (numOfAgree > participants.length / 2) return true;
        else return false;
    }
    useEffect(() => {
        if (flag===true && startVote === true) {
            emitStartVote();
        }
    }, [flag])

    useEffect(()=>{
        console.log(participantsSocketIdList)
        console.log(copyParticipants)
        console.log({participants})
    },[])

    useEffect(()=>{
        if(toggleManner===true){
            //
            let arr =participants
            for(let i = 0; i < arr.length; i++) {
                if(arr[i] === sessionStorage.getItem("nickname"))  {
                    arr.splice(i, 1);
                  i--;
                }
            }
            setCopyParticipants(arr)
        }
    },[toggleManner])




    useEffect(() => {
        if (doneVote()) {
            if (conditionEndMeeting()) {
                setTimeout(()=>{
                    toast("투표가 종료되었습니다. 미팅을 종료합니다.")
                    setToggleManner(true)
                },1000)
              
            }
            else {
                setTimeout(()=>{
                    toast("투표가 종료되었습니다. 미팅을 계속합니다.")
                    //여기수정
                    setStartVote(false)
                    setMyDecision("")
                    setNumOfDisagree(0)
                    setNumOfAgree(0)
                    setIsVote(false)
                    setFlag(false);
                },1000)
            }
        }
    }, [numOfAgree, numOfDisagree])

    let onChangehandler=(e)=>{
        let { name, value } = e.target;
        if(name==="par_name")
        {
            //value는 학점줄 닉네임
            setGoManner({...goManner,["name"]:value})
        }
        else if(name==="realmanner")
        {

            setGoManner({...goManner,["manner"]:Number(value)})

        }
        
        console.log(value)
    }

    let saveManner =async(e)=>{
        let data={
            name:goManner.name,
            manner:goManner.manner
        }
        const res = await axios.post("http://localhost:3001/users/manner",data)
        console.log(res)
        if(res.data==="success"){
            let arr = copyParticipants
            for(let i = 0; i < arr.length; i++) {
                if(arr[i] === goManner.name)  {
                    arr.splice(i, 1);
                  i--;
                }
            }
            alert(`${goManner.name}`+"님에게 학점을 부여하였습니다.")
            
            document.getElementsByName("per_name").values="default"
            document.getElementsByName("realmanner").values="default"
            setCopyParticipants(arr)
            setGoManner({"name":"","manner":""})
            
        }
    }

    let finishMeeting = (e)=>{
        alert("미팅 방을 나갑니다.")
        window.location.href="http://localhost:3000/main"
    }

    useEffect(()=>{
        if(goManner.name!=="" && goManner.manner!==""){
            console.log(goManner)
        }
    },[goManner])
    return (
        
        <div>
            <button className="gradientBtn" onClick={(e) => onClickEndMeetingBtn(e)}>미팅 종료</button>
            <Modal isOpen={toggleEndMeetingBtn}>
                <ModalBody>
                    미팅 종료 버튼을 누르셨습니다.
                    미팅 종료를 위한 투표를 진행하시겠습니까?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={(e) => onClickStartVoteBtn(e)}>투표하기</Button>{' '}
                    <Button color="secondary" onClick={(e) => onClickEndMeetingBtn(e)}>취소</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={toggleManner}>
                <ModalHeader>
                    매너학점
                </ModalHeader>
                <ModalBody>
                <Input type="select" name="par_name" id="par_name" onChange={(e)=>onChangehandler(e)} >
                    <option value="default" selected>닉네임을 선택해주세요.</option>
                   {copyParticipants.map((data,i)=>{
                    return(<option value={data} >{data}</option>)
                   })}
                    </Input>
                {goManner!==""?
                    <span><Input id="realmanner" type="select" name="realmanner" onChange={(e)=>onChangehandler(e)}>
                    <option value="default" selected>학점을 선택해주세요</option>
                    <option value="4.5">A+</option>
                    <option value="4.0">A0</option>
                    <option value="3.5">B+</option>
                    <option value="3.0">B0</option>
                    <option value="2.5">C+</option>
                    <option value="2.0">C0</option>
                    <option value="1.5">D+</option>
                    <option value="1.0">D0</option>
                    <option value="0">F</option>
                    </Input></span>
                :""}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={(e)=>{saveManner(e)}}>학점부여</Button>{' '}
                    <Button color="secondary" onClick={(e)=>finishMeeting(e)}>끝내기</Button>
                </ModalFooter>
            </Modal>
            
            {startVote === true ?
                <div className="voteContainer">
                    <div>미팅을 종료하시겠습니까?</div>
                    {isVote === false ?
                        <div>
                            <button className="agreeBtn" onClick={(e) => onClickAgree(e)}>찬성</button>
                            <button className="disAgreeBtn"onClick={(e) => onClickDisagree(e)}>반대</button>
                        </div>
                        : <div>{myDeicision}하셨습니다.</div>}

                    <Progress multi>
                        <Progress bar style={{backgroundColor:"#2CDB52"}} value={numOfAgree} max={participants.length} />
                        <Progress bar style={{backgroundColor:"#FB6060"}} value={numOfDisagree} max={participants.length} />
                    </Progress>
                </div>
                : ""}
                
      <ToastContainer />
    </div>
  );
});
export default Vote;
