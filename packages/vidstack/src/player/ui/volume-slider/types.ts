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
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/volume-slider}
 * @slot preview - Used to insert a slider preview.
 * @example
 * ```html
 * <media-volume-slider></media-volume-slider>
 * ```
 * @example
 * ```html
 * <media-volume-slider>
 *   <media-slider-value-text
 *     type="pointer"
 *     format="percent"
 *   ></media-slider-value-text>
 * </media-volume-slider>
 * ```
 */
export interface MediaVolumeSliderElement
  extends HTMLCustomElement<VolumeSliderProps, VolumeSliderEvents, VolumeSliderCSSVars>,
    VolumeSliderMembers {}
