// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-media-visibility.ts';
import * as React from 'react';
import { createComponent } from './createComponent';
import { MediaVisibilityElement } from '../../media/manage';

const EVENTS = {
  /**
Fired when media visibility changes based on the viewport position or page visibility state.
*/
  onMediaVisibilityChange: 'vds-media-visibility-change'
} as const;

/** This element is responsible for managing a `MediaProviderElement` as viewport or page
visibility changes occur.

Management includes:

- Playback or volume changes when page visibility changes (eg: user changes tab or device
sleeps).

- Playback or volume changes when viewport visibility changes (eg: user scrolls video in and
out of view). */
const MediaVisibility = createComponent(
  React,
  'vds-media-visibility',
  MediaVisibilityElement,
  EVENTS,
  'MediaVisibility'
);

export default MediaVisibility;
