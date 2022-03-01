// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-gesture';
import * as React from 'react';
import { createComponent } from './createComponent';
import { GestureElement } from '../../ui/gesture';

const EVENTS = {} as const;

/** This element enables 'actions' to be performed on the media provider based on user gestures.

The `GestureElement` can be used to build features such as:

- Click the player to toggle playback.
- Double-click the player to toggle fullscreen.
- Tap the sides of the player to seek forwards or backwards.
- Pause media when the user's mouse leaves the player.

This is a simple list, but it should give you an idea on when to reach for this element. */
const Gesture = createComponent(
  React,
  'vds-gesture',
  GestureElement,
  EVENTS,
  'Gesture'
);

export default Gesture;
