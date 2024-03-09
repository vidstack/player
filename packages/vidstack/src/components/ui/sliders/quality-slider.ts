import throttle from 'just-throttle';
import { Component, computed, effect, peek } from 'maverick.js';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import type { MediaRequestEvents } from '../../../core/api/media-request-events';
import { sortVideoQualities } from '../../../core/quality/utils';
import { $ariaBool } from '../../../utils/aria';
import { setAttributeIfEmpty } from '../../../utils/dom';
import type { SliderCSSVars } from './slider/api/cssvars';
import type {
  SliderDragValueChangeEvent,
  SliderEvents,
  SliderValueChangeEvent,
} from './slider/api/events';
import { sliderState, type SliderState } from './slider/api/state';
import { SliderController, type SliderControllerProps } from './slider/slider-controller';

/**
 * Versatile and user-friendly input video quality control designed for seamless cross-browser and
 * provider compatibility and accessibility with ARIA support. It offers a smooth user experience
 * for both mouse and touch interactions and is highly customizable in terms of styling.
 *
 * @attr data-dragging - Whether slider thumb is being dragged.
 * @attr data-pointing - Whether user's pointing device is over slider.
 * @attr data-active - Whether slider is being interacted with.
 * @attr data-focus - Whether slider is being keyboard focused.
 * @attr data-hocus - Whether slider is being keyboard focused or hovered over.
 * @attr data-supported - Whether setting video quality is supported.
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/quality-slider}
 */
export class QualitySlider extends Component<
  QualitySliderProps,
  QualitySliderState,
  QualitySliderEvents,
  QualitySliderCSSVars
> {
  static props: QualitySliderProps = {
    ...SliderController.props,
    step: 1,
    keyStep: 1,
    shiftKeyMultiplier: 1,
  };

  static state = sliderState;

  private _media!: MediaContext;

  private _sortedQualities = computed(() => {
    const { qualities } = this._media.$state;
    return sortVideoQualities(qualities());
  });

  protected override onSetup(): void {
    this._media = useMediaContext();

    new SliderController({
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: Math.round,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onValueChange: this._onValueChange.bind(this),
    }).attach(this);

    effect(this._watchMax.bind(this));
    effect(this._watchQuality.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-quality-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Video Quality');

    const { qualities, canSetQuality } = this._media.$state,
      $supported = computed(() => canSetQuality() && qualities().length > 0);

    this.setAttributes({
      'data-supported': $supported,
      'aria-hidden': $ariaBool(() => !$supported()),
    });
  }

  private _getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }

  private _getARIAValueText() {
    const { quality } = this._media.$state;

    if (!quality()) return '';

    const { height, bitrate } = quality()!,
      bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1000000).toFixed(2)} Mbps` : null;

    return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ''}` : 'Auto';
  }

  private _watchMax() {
    const $qualities = this._sortedQualities();
    this.$state.max.set(Math.max(0, $qualities.length - 1));
  }

  private _watchQuality() {
    let { quality } = this._media.$state,
      $qualities = this._sortedQualities(),
      value = Math.max(0, $qualities.indexOf(quality()!));
    this.$state.value.set(value);
    this.dispatch('value-change', { detail: value });
  }

  private _isDisabled() {
    const { disabled } = this.$props,
      { canSetQuality, qualities } = this._media.$state;
    return disabled() || qualities().length <= 1 || !canSetQuality();
  }

  private _throttledQualityChange = throttle(this._onQualityChange.bind(this), 25);
  private _onQualityChange(event: SliderValueChangeEvent | SliderDragValueChangeEvent) {
    if (!event.trigger) return;

    const { qualities } = this._media,
      quality = peek(this._sortedQualities)[event.detail];

    this._media.remote.changeQuality(qualities.indexOf(quality), event);
  }

  private _onValueChange(event: SliderValueChangeEvent): void {
    this._throttledQualityChange(event);
  }

  private _onDragValueChange(event: SliderDragValueChangeEvent): void {
    this._throttledQualityChange(event);
  }
}

export interface QualitySliderProps extends SliderControllerProps {}

export interface QualitySliderState extends SliderState {}

export interface QualitySliderEvents
  extends SliderEvents,
    Pick<MediaRequestEvents, 'media-quality-change-request'> {}

export interface QualitySliderCSSVars extends SliderCSSVars {}
