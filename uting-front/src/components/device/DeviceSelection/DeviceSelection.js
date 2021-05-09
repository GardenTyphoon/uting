// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import MicrophoneDevices from './MicrophoneDevices/index';
import SpeakerDevices from './SpeakerDevices';
import CameraDevices from './CameraDevices';

const DeviceSelection = () => (
    <>
      <MicrophoneDevices />
      <SpeakerDevices />
      <CameraDevices />
    </>
);

export default DeviceSelection;
