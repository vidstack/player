import throttle from 'just-throttle';
import { Component, effect, provideContext } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { $ariaBool } from '../../../utils/aria';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import type { SliderCSSVars } from './slider/api/cssvars';
import type {
  SliderDragValueChangeEvent,
  SliderEvents,
  SliderValueChangeEvent,
} from './slider/api/events';
import { sliderState, type SliderState } from './slider/api/state';
import { sliderValueFormatContext } from './slider/format';
import { SliderController, type SliderControllerProps } from './slider/slider-controller';

/**
 * Versatile and user-friendly input volume control designed for seamless cross-browser and provider
 * compatibility and accessibility with ARIA support. It offers a smooth user experience for both
 * mouse and touch interactions and is highly customizable in terms of styling. Users can
 * effortlessly change the volume level within the range 0 (muted) to 100.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @attr data-supported - Whether volume control is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/volume-slider}
 */
export class VolumeSlider extends Component<
  VolumeSliderProps,
  VolumeSliderState,
  VolumeSliderEvents,
  VolumeSliderCSSVars
> {
  static props: VolumeSliderProps = {
    ...SliderController.props,
    keyStep: 5,
    shiftKeyMultiplier: 2,
  };

  static state = sliderState;

  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();

    const { audioGain } = this._media.$state;
    provideContext(sliderValueFormatContext, {
      default: 'percent',
      value(value) {
        return (value * (audioGain() ?? 1)).toFixed(2);
      },
      percent(value) {
        return Math.round(value * (audioGain() ?? 1));
      },
    });

    new SliderController({
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: Math.round,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueMax: this._getARIAValueMax.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onValueChange: this._onValueChange.bind(this),
    }).attach(this);

    effect(this._watchVolume.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-volume-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Volume');

    const { canSetVolume } = this._media.$state;
    this.setAttributes({
      'data-supported': canSetVolume,
      'aria-hidden': $ariaBool(() => !canSetVolume()),
    });
  }

  private _getARIAValueNow() {
    const { value } = this.$state,
      { audioGain } = this._media.$state;
    return Math.round(value() * (audioGain() ?? 1));
  }

  private _getARIAValueText() {
    const { value, max } = this.$state,
      { audioGain } = this._media.$state;
    return round((value() / max()) * (audioGain() ?? 1) * 100, 2) + '%';
  }

  private _getARIAValueMax() {
    const { audioGain } = this._media.$state;
    return this.$state.max() * (audioGain() ?? 1);
  }

  private _isDisabled() {
    const { disabled } = this.$props,
      { canSetVolume } = this._media.$state;
    return disabled() || !canSetVolume();
  }

  private _watchVolume() {
    const { muted, volume } = this._media.$state;
    const newValue = muted() ? 0 : volume() * 100;
    this.$state.value.set(newValue);
    this.dispatch('value-change', { detail: newValue });
  }

  private _throttleVolumeChange = throttle(this._onVolumeChange.bind(this), 25);
  private _onVolumeChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
    if (!event.trigger) return;
    const mediaVolume = round(event.detail / 100, 3);
    this._media.remote.changeVolume(mediaVolume, event);
  }

  private _onValueChange(event: SliderValueChangeEvent): void {
    this._throttleVolumeChange(event);
  }

  private _onDragValueChange(event: SliderDragValueChangeEvent): void {
    this._throttleVolumeChange(event);
  }
}

export interface VolumeSliderProps extends SliderControllerProps {}

export interface VolumeSliderState extends SliderState {}

export interface VolumeSliderEvents
  extends SliderEvents,
    Pick<MediaRequestEvents, 'media-volume-change-request'> {}

export interface VolumeSliderCSSVars extends SliderCSSVars {}
