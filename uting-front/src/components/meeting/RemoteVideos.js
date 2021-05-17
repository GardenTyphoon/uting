import React, { memo } from 'react';

import {useRemoteVideoTileState, RemoteVideo, useRosterState} from 'amazon-chime-sdk-component-library-react'


export const RemoteVideos = (props) => {
  const { roster } = useRosterState();
  const { tiles, tileIdToAttendeeId } = useRemoteVideoTileState();

  return (
    <>
      {tiles.map((tileId) => {
        const attendee = roster[tileIdToAttendeeId[tileId]] || {};
        const { name } = attendee;
        return (
          <RemoteVideo {...props} key={tileId} tileId={tileId} name={name} />
        );
      })}
    </>
  );
};

export default memo(RemoteVideos);