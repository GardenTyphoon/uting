// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Heading,
  PreviewVideo,
  QualitySelection,
  CameraSelection,
  Label
} from 'amazon-chime-sdk-component-library-react';

const CameraDevices = () => {
  return (
    <div>
      <Heading tag="h2" level={6} >
        Video
      </Heading>
      <CameraSelection />
      <QualitySelection />
      <Label style={{ display: 'block', marginBottom: '.5rem' }}>
        Video preview
      </Label>
      <PreviewVideo />
    </div>
  );
};

export default CameraDevices;
