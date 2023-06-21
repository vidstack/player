import throttle from 'just-throttle';
import { Component, effect } from 'maverick.js';
import { setAttribute } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../core/api/media-context';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { round } from '../../../utils/number';
import { canChangeVolume } from '../../../utils/support';
import type { SliderCSSVars } from './slider/api/cssvars';
import type {
  SliderDragValueChangeEvent,
  SliderEvents,
  SliderValueChangeEvent,
} from './slider/api/events';
import { sliderState, type SliderState } from './slider/api/state';
import { SliderController, type SliderControllerProps } from './slider/slider-controller';

export interface VolumeSliderProps extends SliderControllerProps {}

/**
 * A slider control that lets the user specify their desired volume level.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/sliders/volume-slider}
 */
export class VolumeSlider extends Component<
  VolumeSliderProps,
  SliderState,
  SliderEvents,
  SliderCSSVars
> {
  static props: VolumeSliderProps = SliderController.props;
  static state = sliderState;

  private _media!: MediaContext;

  protected override onSetup(): void {
    this._media = useMediaContext();

    new SliderController({
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _isDisabled: this.$props.disabled,
      _roundValue: Math.round,
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onValueChange: this._onValueChange.bind(this),
    }).attach(this);

    effect(this._watchVolume.bind(this));
  }

  protected override onAttach(el: HTMLElement) {
    el.setAttribute('data-media-volume-slider', '');
    setAttributeIfEmpty(el, 'aria-label', 'Media volume');

    if (!__SERVER__) {
      canChangeVolume().then((canSet) => {
        if (!canSet) setAttribute(el, 'aria-hidden', 'true');
      });
    }
  }

  private _getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }

  private _getARIAValueText() {
    const { value, max } = this.$state;
    return round((value() / max()) * 100, 2) + '%';
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
