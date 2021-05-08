// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Heading } from 'amazon-chime-sdk-component-library-react';

// import JoinMeetingDetails from '../container/MeetingJoinDetails';
import DeviceSelection from './DeviceSelection/DeviceSelection';

const DeviceSetup = () => (
  <div>
    <Heading tag="h1" level={3} css="align-self: flex-start">
      Device settings
    </Heading>
    <DeviceSelection />
    <JoinMeetingDetails />
  </div>
);

export default DeviceSetup;
