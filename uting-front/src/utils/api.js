// import routes from '../constants/routes';
import axios from 'axios'

// export const BASE_URL = '/';

// interface MeetingResponse { // .ts 로 작성되었을때 리턴 타입을 Promise로 정의하려고 사용하는 부분임.
//     JoinInfo: {
//         Attendee: any;
//         Meeting: any;
//     };
// }

export async function fetchMeeting(data){
    const response = await fetch(
        `http://localhost:3001/meetings/join`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        },
    );
    const resData = await response.json();

    if(resData.error){
        throw new Error(`Server error: ${resData.error}`);
    }
    return resData;
}

export function createGetAttendeeCallback(meetingId){

    return (chimeAttendeeId)=>{

        let res
        let Name=""
        console.log("createGetAttendeeCallback")
        let attendeeGet = async()=>{
            console.log("attendeeGet")
            let data={
                meetingId : meetingId,
                attendee : chimeAttendeeId
            }
            res = await axios.post("http://localhost:3001/meetings/attendee",data)
            //console.log(res.data.AttendeeInfo.Name)
            //Name=res.data.AttendeeInfo.Name
            //console.log(Name)
            if(Name!==""){
                console.log("Name",Name)
                return{
                    name: res.data.Name
                }
            }
        }
        attendeeGet()
        
        
    }
    
/*
    return async (chimeAttendeeId,externalUserId) => {
        const attendeeUrl = `http://localhost:3001/meetings/attendee?title=${encodeURIComponent(
            meetingId
        )}$attendee=${encodeURIComponent(chimeAttendeeId)}`;
        const res = await fetch(attendeeUrl, {
            method: 'GET',
        });

        if(!res.ok){
            throw new Error('Invalid server response');
        }

        const data = await res.json();

        return {
            name: data.AttendeeInfo.Name
        };
    };*/
}

export async function endMeeting(meetingId){
    const res = await fetch(
        `http://localhost:3001/end?title=${encodeURIComponent(meetingId)}`,
        {
            method: 'POST'
        }
    );

    if(!res.ok){
        throw new Error('Server error ending meeting');
    }
}