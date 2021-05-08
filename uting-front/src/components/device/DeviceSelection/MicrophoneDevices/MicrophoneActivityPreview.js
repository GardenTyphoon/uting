// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Label } from 'amazon-chime-sdk-component-library-react';

import MicrophoneActivityPreviewBar from './MicrophoneActivityPreviewBar';

const MicrophoneActivityPreview = () => {
  return (
    <>
      <Label style={{ display: 'block', marginBottom: '.5rem' }}>
        Microphone activity
      </Label>
      <MicrophoneActivityPreviewBar />
    </>
  );
};

export default MicrophoneActivityPreview;
