// [@celement/cli] THIS FILE IS AUTO GENERATED - SEE `celement.config.ts`

import '../../define/vds-slider.ts';
import * as React from 'react';
import { createComponent } from './createComponent';
import { SliderElement } from '../../ui/slider';

const EVENTS = {
  /**
Fired when the user stops dragging the slider thumb. The event detail contains the value
the drag is ending at.
*/
  onSliderDragEnd: 'vds-slider-drag-end',
  /**
Fired when the user begins interacting with the slider and dragging the thumb. The event
detail contains the current value the drag is starting at.
*/
  onSliderDragStart: 'vds-slider-drag-start',
  /**
Fired when the slider drag value changes. The drag value indicates the last slider value that
the user has dragged to. The event detail contains the value.
*/
  onSliderDragValueChange: 'vds-slider-drag-value-change',
  /**
Fired when the device pointer is inside the slider region and it's position changes. The
event detail contains the value.
*/
  onSliderPointerValueChange: 'vds-slider-pointer-value-change',
  /**
Fired when the slider value changes. The event detail contains the current value.
*/
  onSliderValueChange: 'vds-slider-value-change'
} as const;

/** A custom built `input[type="range"]` that is cross-browser friendly, ARIA friendly, mouse/touch
friendly and easily stylable. This component allows users to input numeric values between a
minimum and maximum value.

💡 The following attributes are also available on the host element:

- `pointing`: Whether a device pointer is within the slider bounds.
- `dragging`: Whether the slider thumb is currently being dragged.
- `interactive`: When either `pointing` or `dragging` is true. */
const Slider = createComponent(
  React,
  'vds-slider',
  SliderElement,
  EVENTS,
  'Slider'
);

export default Slider;
