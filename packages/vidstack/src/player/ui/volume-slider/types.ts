import type { HTMLCustomElement } from 'maverick.js/element';

import type { SliderCSSVars, SliderEvents, SliderMembers, SliderProps } from '../slider/types';

export interface VolumeSliderProps extends SliderProps {}

export interface VolumeSliderEvents extends SliderEvents {}

export interface VolumeSliderCSSVars extends SliderCSSVars {}

export interface VolumeSliderMembers
  extends Omit<SliderMembers, 'min' | 'max' | 'value'>,
    Readonly<Pick<SliderMembers, 'min' | 'max' | 'value'>> {}

/**
 * A slider control that lets the user specify their desired volume level.
 *
 * @tagname vds-volume-slider
 * @slot - Used to pass in slider parts such as the thumb or track.
 * @example
 * ```html
 * <vds-volume-slider>
 *   <div class="thumb"></div>
 * </vds-volume-slider>
 * ```
 */
export interface VolumeSliderElement
  extends HTMLCustomElement<VolumeSliderProps, VolumeSliderEvents, VolumeSliderCSSVars>,
    VolumeSliderMembers {}
