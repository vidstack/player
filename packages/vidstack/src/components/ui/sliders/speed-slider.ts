import throttle from 'just-throttle';
import { Component, effect } from 'maverick.js';

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
import { SliderController, type SliderControllerProps } from './slider/slider-controller';

/**
 * Versatile and user-friendly input playback rate control designed for seamless cross-browser and
 * provider compatibility and accessibility with ARIA support. It offers a smooth user experience
 * for both mouse and touch interactions and is highly customizable in terms of styling.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @attr data-supported - Whether setting playback rate is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/speed-slider}
 */
export class SpeedSlider extends Component<
  SpeedSliderProps,
  SpeedSliderState,
  SpeedSliderEvents,
  SpeedSliderCSSVars
> {
  static props: SpeedSliderProps = {
    ...SliderController.props,
    step: 0.25,
    keyStep: 0.25,
    shiftKeyMultiplier: 2,
    min: 0,
    max: 2,
  };

  static state = sliderState;

  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();

    new SliderController({
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: this._roundValue,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onValueChange: this._onValueChange.bind(this),
    }).attach(this);

    effect(this._watchMinMax.bind(this));
    effect(this._watchPlaybackRate.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-speed-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Speed');

    const { canSetPlaybackRate } = this._media.$state;
    this.setAttributes({
      'data-supported': canSetPlaybackRate,
      'aria-hidden': $ariaBool(() => !canSetPlaybackRate()),
    });
  }

  private _getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }

  private _getARIAValueText() {
    const { value } = this.$state;
    return value() + 'x';
  }

  private _watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }

  private _watchPlaybackRate() {
    const { playbackRate } = this._media.$state;
    const newValue = playbackRate();
    this.$state.value.set(newValue);
    this.dispatch('value-change', { detail: newValue });
  }

  private _roundValue(value: number) {
    return round(value, 2);
  }

  private _isDisabled() {
    const { disabled } = this.$props,
      { canSetPlaybackRate } = this._media.$state;
    return disabled() || !canSetPlaybackRate();
  }

  private _throttledSpeedChange = throttle(this._onPlaybackRateChange.bind(this), 25);
  private _onPlaybackRateChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
    if (!event.trigger) return;
    const rate = event.detail;
    this._media.remote.changePlaybackRate(rate, event);
  }

  private _onValueChange(event: SliderValueChangeEvent): void {
    this._throttledSpeedChange(event);
  }

  private _onDragValueChange(event: SliderDragValueChangeEvent): void {
    this._throttledSpeedChange(event);
  }
}

export interface SpeedSliderProps extends SliderControllerProps {
  /**
   * The minimum playback rate.
   */
  min: number;
  /**
   * The maximum playback rate.
   */
  max: number;
}

export interface SpeedSliderState extends SliderState {}

export interface SpeedSliderEvents
  extends SliderEvents,
    Pick<MediaRequestEvents, 'media-rate-change-request'> {}

export interface SpeedSliderCSSVars extends SliderCSSVars {}
