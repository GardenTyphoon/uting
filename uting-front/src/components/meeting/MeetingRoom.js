import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import {
    Grid,
    VideoTileGrid,
    UserActivityProvider,
    MeetingStatus,
    useNotificationDispatch,
    Severity,
    ActionType,
    useMeetingStatus,
    LocalVideo,
//    RemoteVideos,
} from 'amazon-chime-sdk-component-library-react';

import RemoteVideos from './RemoteVideos';
import MeetingControls from './MeetingControls';
import MeetingDetails from './MeetingDetails';

export default function Rooms() {
    const history = useHistory();
    const dispatch = useNotificationDispatch();
    const meetingStatus = useMeetingStatus();

    useEffect(() => {
        if (meetingStatus === MeetingStatus.Ended) {
            console.log('[useMeetingEndRedirect] Meeting ended');
            dispatch({
                type: ActionType.ADD,
                payload: {
                    severity: Severity.INFO,
                    message: 'The meeting was ended by another attendee',
                    autoClose: true,
                    replaceAll: true
                }
            });
            history.push('/main');
        }
    }, [meetingStatus]);

    return (
        <div>
            <UserActivityProvider>
                <Grid
                responsive
                gridGap="100px"
                gridTemplateColumns="repeat(4, 350px)"
                gridTemplateRows="repeat(2, 350px)"
                gridAutoFlow="dense"
                >
                    <LocalVideo />
                    <RemoteVideos />
                </Grid>
                <MeetingControls />
            </UserActivityProvider>
        </div>
    );
}
