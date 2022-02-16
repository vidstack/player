// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-media-visibility.ts';
import * as React from 'react';
import { createComponent } from '@lit-labs/react';
import { MediaVisibilityElement } from '../../media/manage';

const EVENTS = {
  /**
Fired when media visibility changes based on the viewport position or page visibility state.
*/
  onMediaVisibilityChange: 'vds-media-visibility-change'
} as const;

export default createComponent(
  React,
  'vds-media-visibility',
  MediaVisibilityElement,
  EVENTS,
  'MediaVisibility'
);
