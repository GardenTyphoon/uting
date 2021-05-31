import axios from 'axios'


export async function fetchMeeting(data){
    const response = await fetch(
        `http://localhost:3001/meetings/create`,
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
        console.log("createGetAttendeeCallback")
        let attendeeGet = async()=>{
            console.log("attendeeGet")
            let data={
                meetingId : meetingId,
                attendee : chimeAttendeeId
            }
            res = await axios.post("http://localhost:3001/meetings/attendee", data)
            
            if(res.data.Name!==""){
                return{
                    name: res.data.Name
                }
            }
        }
        attendeeGet()
        
        
    }

}

export async function endMeeting(meetingId){

    console.log(meetingId)
    const data = {title : meetingId};
    const res = await axios.post('http://localhost:3001/meetings/end', data);

    if(!res.ok){
        throw new Error('Server error ending meeting');
    }
}