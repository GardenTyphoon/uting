import React from 'react';
import MeetingList from './MeetingList.js';
import Meeting from './Meeting.js';
import { useState } from 'react';
import PartitionForm from './PartitionForm'

export default function MeetingListForm() {
    const [isOpen,setIsOpen] = useState(false);
    
    const openModal = () =>{
        setIsOpen(true);
    }
    const closeModal = () =>{
        setIsOpen(false);
    }
        
    return(
        <React.Fragment>
            <Meeting/>
            <MeetingList/>
            <button>빠른매칭</button>
            <button>설정</button>
            <button>리프레쉬</button>
            <button>뒤로가기</button>
            <button>파티션정보</button>
            <button onClick={openModal}>파티션생성</button>
            <PartitionForm isPartitionOpen={isOpen} close={closeModal}/>
        </React.Fragment>
    )
}