import type { HTMLCustomElement } from 'maverick.js/element';

import type { SliderCSSVars, SliderEvents, SliderMembers, SliderProps } from '../slider/types';

export interface TimeSliderProps extends SliderProps {
  /**
   * Whether it should request playback to pause while the user is dragging the
   * thumb. If the media was playing before the dragging starts, the state will be restored by
   * dispatching a user play request once the dragging ends.
   */
  pauseWhileDragging: boolean;
  /**
   * The amount of milliseconds to throttle media seeking request events being dispatched.
   */
  seekingRequestThrottle: number;
}

export interface TimeSliderEvents extends SliderEvents {}

export interface TimeSliderCSSVars extends SliderCSSVars {}

export interface TimeSliderMembers
  extends Omit<SliderMembers, 'min' | 'max' | 'value'>,
    Readonly<Pick<SliderMembers, 'min' | 'max' | 'value'>> {}

/**
 * A slider control that lets the user specify their desired time level.
 *
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
