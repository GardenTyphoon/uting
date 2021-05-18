import React from 'react';
import {
  ControlBar,
  AudioInputControl,
  VideoInputControl,
  ContentShareControl,
  AudioOutputControl,
  ControlBarButton,
  Dots,
} from 'amazon-chime-sdk-component-library-react';

import EndMeetingControl from './EndMeetingControl';
import { useNavigation } from '../../providers/NavigationProvider';


const MeetingControls = () => {
  const { toggleNavbar, closeRoster, showRoster } = useNavigation();

  const handleToggle = () => {
    if (showRoster) {
      closeRoster();
    }

    toggleNavbar();
  };

  return (
      <ControlBar
        className="controls-menu"
        layout="undocked-horizontal"
        showLabels
      >
        <AudioInputControl />
        <VideoInputControl />
        <AudioOutputControl />
        <EndMeetingControl />
      </ControlBar>
  );
};

export default MeetingControls;