import React from 'react';
import {
  ControlBar,
  AudioInputControl,
  VideoInputControl,
  ContentShareControl,
  AudioOutputControl,
  ControlBarButton,
  Dots
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
        <ControlBarButton
          className="mobile-toggle"
          icon={<Dots />}
          onClick={handleToggle}
          label="Menu"
        />
        <AudioInputControl />
        <VideoInputControl />
        <ContentShareControl />
        <AudioOutputControl />
        <EndMeetingControl />
      </ControlBar>
  );
};

export default MeetingControls;