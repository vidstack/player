// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-play-button';
import * as React from 'react';
import { createComponent } from './createComponent';
import { PlayButtonElement } from '../../ui/play-button';

const EVENTS = {} as const;

/** A button for toggling the playback state (play/pause) of the current media.

💡 The following media attributes are applied:

- `media-paused`: Applied when media playback has paused. */
const PlayButton = createComponent(
  React,
  'vds-play-button',
  PlayButtonElement,
  EVENTS,
  'PlayButton'
);

export default PlayButton;
