// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-media-sync';
import * as React from 'react';
import { createComponent } from './createComponent';
import { MediaSyncElement } from '../../media/manage';

const EVENTS = {
  /**
Fired when media volume has been synchronized.
*/
  onMediaVolumeSync: 'vds-media-volume-sync'
} as const;

/** This element is responsible for synchronizing elements of the type `MediaProviderElement`.

Synchronization includes:

- Single media playback (eg: user plays a video while another is already playing, so we pause
the newly inactive player).

- Shared media volume (eg: user sets desired volume to 50% on one player, and they expect it to
be consistent across all players).

- Saving media volume to local storage (eg: user sets desired to volume 50%, they leave
the site, and when they come back they expect it to be 50% without any interaction). */
const MediaSync = createComponent(
  React,
  'vds-media-sync',
  MediaSyncElement,
  EVENTS,
  'MediaSync'
);

export default MediaSync;
