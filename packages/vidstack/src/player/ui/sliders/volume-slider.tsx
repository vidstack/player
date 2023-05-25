import throttle from 'just-throttle';
import { effect } from 'maverick.js';
import { defineElement, defineProp, type HTMLCustomElement } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import { canChangeVolume } from '../../../utils/support';
import type { SliderDragValueChangeEvent, SliderValueChangeEvent } from './slider/api/events';
import { sliderProps } from './slider/api/props';
import { SliderStoreFactory } from './slider/api/store';
import { Slider, type SliderAPI } from './slider/slider';

declare global {
  interface MaverickElements {
    'media-volume-slider': MediaVolumeSliderElement;
  }
}

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
 *   <media-slider-value
 *     type="pointer"
 *     format="percent"
 *   ></media-slider-value>
 * </media-volume-slider>
 * ```
 */
export class VolumeSlider extends Slider<VolumeSliderAPI> {
  static override el = defineElement<VolumeSliderAPI>({
    tagName: 'media-volume-slider',
    props: {
      ...sliderProps,
      min: defineProp({ value: 0, attribute: false }),
      max: defineProp({ value: 100, attribute: false }),
      value: defineProp({ value: 100, attribute: false }),
    },
    store: SliderStoreFactory,
  });

  protected override _readonly = true;

  protected override onAttach(el: HTMLElement) {
    setAttributeIfEmpty(el, 'aria-label', 'Media volume');
    super.onAttach(el);

    if (!__SERVER__) {
      canChangeVolume().then((canSet) => {
        if (!canSet) setAttribute(el, 'aria-hidden', 'true');
      });
    }

    effect(this._watchVolume.bind(this));
  }

  protected _watchVolume() {
    const { muted, volume } = this._media.$store;
    const newValue = muted() ? 0 : volume() * 100;
    this.$store.value.set(newValue);
    this.dispatch('value-change', { detail: newValue });
  }

  protected _throttleVolumeChange = throttle(this._onVolumeChange.bind(this), 25);
  protected _onVolumeChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
    if (!event.trigger) return;
    const mediaVolume = round(event.detail / 100, 3);
    this._media.remote.changeVolume(mediaVolume, event);
  }

  override _onValueChange(event: SliderValueChangeEvent): void {
    this._throttleVolumeChange(event);
  }

  override _onDragValueChange(event: SliderDragValueChangeEvent): void {
    this._throttleVolumeChange(event);
  }

  protected override _getARIAValueMin(): number {
    return 0;
  }

  protected override _getARIAValueMax(): number {
    return 100;
  }
}

export interface MediaVolumeSliderElement extends HTMLCustomElement<VolumeSlider> {}

export interface VolumeSliderAPI extends SliderAPI {}
