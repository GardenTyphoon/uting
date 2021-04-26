import React from 'react';
import MeetingList from './MeetingList.js';
import Meeting from './Meeting.js';
import { useState } from 'react';


export default function MeetingListForm() {
    
        
    return(
        <React.Fragment>
            <Meeting/>
            <MeetingList/>
        </React.Fragment>
    )
}