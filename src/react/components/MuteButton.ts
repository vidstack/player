// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-mute-button';
import * as React from 'react';
import { createComponent } from './createComponent';
import { MuteButtonElement } from '../../ui/mute-button';

const EVENTS = {} as const;

/** A button for toggling the muted state of the player.

💡 The following media attributes are applied:

- `media-muted`: Applied when media audio has been muted. */
const MuteButton = createComponent(
  React,
  'vds-mute-button',
  MuteButtonElement,
  EVENTS,
  'MuteButton'
);

export default MuteButton;
