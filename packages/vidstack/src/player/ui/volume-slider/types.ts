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
 * @docs {@link https://www.vidstack.io/docs/player/components/ui/volume-slider}
 * @slot preview - Used to insert a slider preview.
 * @example
 * ```html
 * <vds-volume-slider></vds-volume-slider>
 * ```
 * @example
 * ```html
 * <vds-volume-slider>
 *   <vds-slider-value-text
 *     type="pointer"
 *     format="percent"
 *   ></vds-slider-value-text>
 * </vds-volume-slider>
 * ```
 */
export interface VolumeSliderElement
  extends HTMLCustomElement<VolumeSliderProps, VolumeSliderEvents, VolumeSliderCSSVars>,
    VolumeSliderMembers {}
