import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import camera_on from "../../img/cam_on.png";
import camera_off from "../../img/cam_off.png";

import {
  Grid,
  VideoTileGrid,
  UserActivityProvider,
  MeetingStatus,
  useNotificationDispatch,
  Severity,
  ActionType,
  useMeetingStatus,
  AudioInputControl,
  VideoInputControl,
  AudioOutputControl,
  //    RemoteVideos,
} from "amazon-chime-sdk-component-library-react";

import LocalVideo from "./LocalVideo";
import RemoteVideos from "./RemoteVideos";

const temp = {
  background: "white",
  border: "15px solid white",
  borderRadius: "30px",
};

export default function Rooms(props) {
  const history = useHistory();
  const dispatch = useNotificationDispatch();
  const meetingStatus = useMeetingStatus();
  const [localView, setlocalView] = useState(false);
  const [maxNum, setmaxNum] = useState();

  useEffect(() => {
    if (meetingStatus === MeetingStatus.Ended) {
      console.log("[useMeetingEndRedirect] Meeting ended");
      dispatch({
        type: ActionType.ADD,
        payload: {
          severity: Severity.INFO,
          message: "The meeting was ended by another attendee",
          autoClose: true,
          replaceAll: true,
        },
      });
      history.push("/main");
    }
  }, [meetingStatus]);

  return (
    <div>
      <UserActivityProvider>
        <Grid
          responsive
          gridGap="10px"
          gridTemplateRows="repeat(2, 18vw)"
          gridTemplateColumns="repeat(4, 18vw)"
          gridAutoFlow="dense"
        >
          <LocalVideo />
          <RemoteVideos info={props} max={maxNum} />
        </Grid>
      </UserActivityProvider>
    </div>
  );
}
