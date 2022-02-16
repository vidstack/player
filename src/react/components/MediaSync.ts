// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-media-sync.ts';
import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import { MediaSyncElement } from '../../media/manage';

const EVENTS = {
  /**
Fired when media volume has been synchronized.
*/
  onMediaVolumeSync: 'vds-media-volume-sync'
} as const;

export default createComponent(
  React,
  'vds-media-sync',
  MediaSyncElement,
  EVENTS,
  'MediaSync'
);
