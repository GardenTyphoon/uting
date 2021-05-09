import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import {
    VideoTileGrid,
    UserActivityProvider,
    MeetingStatus,
    useNotificationDispatch,
    Severity,
    ActionType,
    useMeetingStatus
} from 'amazon-chime-sdk-component-library-react';

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
                <VideoTileGrid className="videos" noRemoteVideoView={<MeetingDetails />} />
                <MeetingControls />
            </UserActivityProvider>
        </div>
    );
}
