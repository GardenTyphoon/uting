// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

// type Props = {
//   children: ReactNode;
// };

// interface AppStateValue {
//   meetingId;
//   localUserName;
//   theme;
//   region;
//   toggleTheme: () => void; 
//   setAppMeetingInfo: (meetingId, name, region) => void;
// }

const AppStateContext = React.createContext({
  meetingId: "",
  localUserName: "",
  theme: "",
  region: "",
  toggleTheme: () => {},
  setAppMeetingInfo: (meetingId, name, region) => {},
});

export function useAppState() {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return state;
}



export function AppStateProvider({ children }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [meetingId, setMeeting] = useState(query.get('meetingId') || '');
  const [region, setRegion] = useState(query.get('region') || '');
  const [localUserName, setLocalName] = useState('');
  // const [theme, setTheme] = useState(() => {
  //   const storedTheme = localStorage.getItem('theme');
  //   return storedTheme || 'light';
  // });

  // const toggleTheme = () => {
  //   if (theme === 'light') {
  //     setTheme('dark');
  //     localStorage.setItem('theme', 'dark');
  //   } else {
  //     setTheme('light');
  //     localStorage.setItem('theme', 'light');
  //   }
  // };

  const setAppMeetingInfo = (meetingId, name, region) => {
    setRegion(region);
    setMeeting(meetingId);
    setLocalName(name);
  };

  const providerValue = {
    meetingId,
    localUserName,
    // theme,
    region,
    // toggleTheme,
    setAppMeetingInfo
  };

  return (
    <AppStateContext.Provider value={providerValue}>
      {children}
    </AppStateContext.Provider>
  );
}
