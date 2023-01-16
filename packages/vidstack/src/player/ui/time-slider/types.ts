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
 * @docs {@link https://www.vidstack.io/docs/player/components/ui/time-slider}
 * @slot preview - Used to insert a slider preview.
 * @example
 * ```html
 * <vds-time-slider></vds-time-slider>
 * ```
 * @example
 * ```html
 * <vds-time-slider>
 *   <vds-slider-value-text
 *     type="pointer"
 *     format="time"
 *     slot="preview"
 *   ></vds-slider-value-text>
 * </vds-time-slider>
 * ```
 */
export interface TimeSliderElement
  extends HTMLCustomElement<TimeSliderProps, TimeSliderEvents, TimeSliderCSSVars>,
    TimeSliderMembers {}
