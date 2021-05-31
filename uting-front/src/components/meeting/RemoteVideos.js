import React, { memo, useState } from 'react';
import camera_on from '../../img/cam_on.png';
import camera_off from '../../img/cam_off.png';
import { useAppState } from '../../providers/AppStateProvider';
import styles from './RemoteVideos.css';
import {  
  useRemoteVideoTileState, 
  RemoteVideo, 
  useRosterState,
  Grid,
} from 'amazon-chime-sdk-component-library-react'
import styled from 'styled-components';



const my_style = {
  width: "auto",
  height: "auto",
}
const temp = {
  background: "white",
  border: "15px solid white",
  borderRadius: "30px"
}
const info = {
  fontFamily: "NanumSquare_acR",
  textAlign: "center"
}


export const RemoteVideos = (props) => {
  const { roster } = useRosterState();
  const { tiles, tileIdToAttendeeId } = useRemoteVideoTileState();
  const [remoteView, setremoteView] = useState(true);
  console.log(tiles.length);

  
  return (
    <>
      {tiles.map((tileId) => {
        const attendee = roster[tileIdToAttendeeId[tileId]] || {};
        let name = "";
        for (let property in props.info.info) {
          if(attendee.chimeAttendeeId == property) {name = props.info.info[property]; break;}
        }

        return (
          <div style={temp}>
            <Grid                
              responsive
              gridTemplateRows="repeat(1, 2vw) repeat(1, 14vw)"
              gridAutoFlow="dense"
              color="white"
              >
              
                <Grid
                  responsive
                  gridTemplateRows="repeat(1, 2vw)"
                  gridTemplateColumns="repeat(3, 33%)"
                  gridAutoFlow="dense"
                  color="white">
                    <div onClick={() => setremoteView(!remoteView)}>
                      {remoteView ? <img style={my_style} src={camera_on} /> : <img style={my_style} src={camera_off}/>}
                    </div>
                    <div style={info}>{name}</div>
                </Grid>
                
                
                
              {remoteView ? <RemoteVideo  {...props} key={tileId} tileId={tileId} /> : <div style={temp}></div>}
            </Grid>
          
          </div>
        );
      })}
    </>
  );
};

export default memo(RemoteVideos);