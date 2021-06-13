import axios from "axios";
import baseurl from "./baseurl";
import defaultAxios from "./defaultAxios";

export async function fetchMeeting(data) {
  const response = await fetch('/api/meetings/create', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();

  if (resData.error) {
    throw new Error(`Server error: ${resData.error}`);
  }
  return resData;
}

export function createGetAttendeeCallback(meetingId) {
  return (chimeAttendeeId) => {
    let res;
    console.log("createGetAttendeeCallback");
    let attendeeGet = async () => {
      console.log("attendeeGet");
      let data = {
        meetingId: meetingId,
        attendee: chimeAttendeeId,
      };
      res = await defaultAxios.post(`/meetings/attendee`, data);

      if (res.data.Name !== "") {
        return {
          name: res.data.Name,
        };
      }
    };
    attendeeGet();
  };
}

export async function endMeeting(meetingId) {
  console.log(meetingId);
  const data = { title: meetingId };
  const res = await defaultAxios.post(`/meetings/end`, data);

  // if(!res.ok){
  //     throw new Error('Server error ending meeting');
  // }
}
