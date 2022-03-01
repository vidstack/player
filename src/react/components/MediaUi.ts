// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-media-ui';
import * as React from 'react';
import { createComponent } from './createComponent';
import { MediaUiElement } from '../../media/ui';

const EVENTS = {} as const;

/** This is a general styling container which holds your UI elements. Media attributes and
CSS properties are exposed on this element to help you style your UI elements.

Example media attributes include: `media-paused`, `media-can-play`, and `media-waiting`.

Example media CSS properties include: `--media-seekable-amount`, `--media-buffered-amount`,
and `--media-duration`.

This element also handles hiding the UI depending on whether native UI can't be hidden
(*cough* iOS). This is simply to avoid double controls (native + custom). The `hidden` attribute
will be applied to prevent it from happening. */
const MediaUi = createComponent(
  React,
  'vds-media-ui',
  MediaUiElement,
  EVENTS,
  'MediaUi'
);

export default MediaUi;
