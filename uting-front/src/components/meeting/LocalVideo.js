import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';



import { 
    useAudioVideo,
    useLocalVideo,
    VideoTile,
    useApplyVideoObjectFit,


} from 'amazon-chime-sdk-component-library-react';

const StyledLocalVideo = styled(VideoTile)`
  ${(props) => (!props.active ? 'display: none' : '')};
`;

export const LocalVideo = ({ nameplate, ...rest }) => {
  const { tileId, isVideoEnabled } = useLocalVideo(true);
  const audioVideo = useAudioVideo();
  const videoEl = useRef(null);
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
    <StyledLocalVideo
      active={isVideoEnabled}
      nameplate={nameplate}
      ref={videoEl}
      {...rest}
    />
  );
};

export default LocalVideo;