import type { HTMLCustomElement } from 'maverick.js/element';

import type { SliderCSSVars, SliderEvents, SliderMembers } from '../slider/types';
import type { TimeSliderProps } from './props';

export { TimeSliderProps };

export interface TimeSliderEvents extends SliderEvents {}

export interface TimeSliderCSSVars extends SliderCSSVars {}

export interface TimeSliderMembers
  extends Omit<SliderMembers, 'min' | 'max' | 'value'>,
    Readonly<Pick<SliderMembers, 'min' | 'max' | 'value'>> {}

/**
 * A slider control that lets the user specify their desired time level.
 *
 * @tagname vds-time-slider
 * @slot - Used to pass in slider parts such as the thumb or track.
 * @example
 * ```html
 * <vds-time-slider>
 *   <div class="thumb"></div>
 * </vds-time-slider>
 * ```
 */
export interface TimeSliderElement
  extends HTMLCustomElement<TimeSliderProps, TimeSliderEvents, TimeSliderCSSVars>,
    TimeSliderMembers {}
