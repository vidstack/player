// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-slider-video.ts';
import * as React from 'react';
import { createComponent } from './createComponent';
import { SliderVideoElement } from '../../ui/slider';

const EVENTS = {} as const;

/** Used to load a low-resolution video to be displayed when the user is hovering or dragging
the slider. The point at which they're hovering or dragging (`pointerValue`) is the preview
time position. The video will automatically be updated to match, so ensure it's of the same
length as the original.

💡 The following attributes are updated for your styling needs:

- `video-can-play`: Applied when the video is ready for playback.
- `video-error`: Applied when a media error has been encountered.

💡 The `canplay` and `error` events are re-dispatched by this element for you to listen to if
needed. */
const SliderVideo = createComponent(
  React,
  'vds-slider-video',
  SliderVideoElement,
  EVENTS,
  'SliderVideo'
);

export default SliderVideo;
