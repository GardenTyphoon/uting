import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
    useAudioVideo,
    useLocalVideo,
    VideoTile,
    useApplyVideoObjectFit,
    Grid,

} from 'amazon-chime-sdk-component-library-react';

const StyledLocalVideo = styled(VideoTile)`
  ${(props) => (!props.active ? 'display: none' : '')};
`;

const temp = {
  background: "white",
  border: "15px solid white",
  borderRadius: "30px"
}
const info = {
  fontFamily: "NanumSquare_acR",
  textAlign: "center"
}

export const LocalVideo = ({ nameplate, ...rest }) => {
  const { tileId, isVideoEnabled } = useLocalVideo(true);
  const audioVideo = useAudioVideo();
  const videoEl = useRef(null);
  let sessionUser = sessionStorage.getItem("nickname");
  useApplyVideoObjectFit(videoEl);

  useEffect(() => {
    if (!audioVideo || !tileId || !videoEl.current || !isVideoEnabled) {
      return;
    }

    audioVideo.bindVideoElement(tileId, videoEl.current);

    return () => {
      const tile = audioVideo.getVideoTile(tileId);
      if (tile) {
        audioVideo.unbindVideoElement(tileId);
      }
    };
  }, [audioVideo, tileId, isVideoEnabled]);

  return (
    <div style={temp}>
      <Grid                
            responsive
            gridTemplateRows="repeat(1, 2vw) repeat(1, 14vw)"
            gridAutoFlow="dense"
            color="white"

            
            >
    <div style={info}>{sessionUser}</div>
    <StyledLocalVideo
      active={isVideoEnabled}
      nameplate={nameplate}
      ref={videoEl}
      {...rest}
    />
    </Grid>
    </div>
  );
};

export default LocalVideo;