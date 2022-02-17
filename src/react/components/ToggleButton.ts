// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-toggle-button.ts';
import * as React from 'react';
import { createComponent } from './createComponent';
import { ToggleButtonElement } from '../../ui/toggle-button';

const EVENTS = {} as const;

/** The foundation for any toggle button such as a `play-button` or `mute-button`. */
const ToggleButton = createComponent(
  React,
  'vds-toggle-button',
  ToggleButtonElement,
  EVENTS,
  'ToggleButton'
);

export default ToggleButton;
