import React, { memo, useState } from 'react';
import camera_on from '../../img/camera_on.png';
import camera_off from '../../img/camera_off.png';
import {  
  useRemoteVideoTileState, 
  RemoteVideo, 
  useRosterState,
  Grid,
} from 'amazon-chime-sdk-component-library-react'
const my_style = {
  width: "auto",
  height: "auto",
}
const temp = {
  background: "white",
  border: "15px solid white",
  borderRadius: "30px"
}

export const RemoteVideos = (props) => {
  const { roster } = useRosterState();
  const { tiles, tileIdToAttendeeId } = useRemoteVideoTileState();
  const [remoteView, setremoteView] = useState(true);




  return (
    <>
      {tiles.map((tileId) => {
        const attendee = roster[tileIdToAttendeeId[tileId]] || {};
        const { name } = attendee;
        return (
          <div style={temp}>
          <Grid                
            responsive
            gridTemplateRows="repeat(1, 2vw) repeat(1, 14vw)"
            gridAutoFlow="dense"
            color="white"

            
            >
            <span  onClick={() => setremoteView(!remoteView)}>{remoteView ? <img style={my_style} src={camera_on} /> : <img style={my_style} src={camera_off}/>} </span>
            {remoteView ? <RemoteVideo  {...props} key={tileId} tileId={tileId} name={name} /> : ""}
            
          </Grid>
          </div>
        );
      })}
    </>
  );
};

export default memo(RemoteVideos);