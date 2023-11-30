import { Component, effect, hasProvidedContext, method, prop, useContext } from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import { menuContext, type MenuContext } from '../menu-context';
import type { RadioOption } from '../radio/radio';
import { RadioGroupController } from '../radio/radio-group-controller';

/**
 * This component manages playback rate radios.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/playback-rate-menu}
 */
export class SpeedRadioGroup extends Component<SpeedRadioGroupProps, {}, SpeedRadioGroupEvents> {
  static props: SpeedRadioGroupProps = {
    normalLabel: 'Normal',
    rates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  };

  private _media!: MediaContext;
  private _menu?: MenuContext;
  private _controller: RadioGroupController;

  @prop
  get value() {
    return this._controller.value;
  }

  @prop
  get disabled() {
    const { rates } = this.$props,
      { canSetPlaybackRate } = this._media.$state;
    return !canSetPlaybackRate() || rates().length === 0;
  }

  constructor() {
    super();
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }

  protected override onSetup(): void {
    this._media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this._menu = useContext(menuContext);
    }
  }

  protected override onConnect(el: HTMLElement) {
    effect(this._watchValue.bind(this));
    effect(this._watchHintText.bind(this));
    effect(this._watchControllerDisabled.bind(this));
  }

  @method
  getOptions(): RadioOption[] {
    const { rates, normalLabel } = this.$props;
    return rates().map((rate) => ({
      label: rate === 1 ? normalLabel : rate + '×',
      value: rate + '',
    }));
  }

  private _watchValue() {
    this._controller.value = this._getValue();
  }

  private _watchHintText() {
    const { normalLabel } = this.$props,
      { playbackRate } = this._media.$state,
      rate = playbackRate();
    this._menu?._hint.set(rate === 1 ? normalLabel() : rate + '×');
  }

  private _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }

  private _getValue() {
    const { playbackRate } = this._media.$state;
    return playbackRate() + '';
  }

  private _onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;
    const rate = +value;
    this._media.remote.changePlaybackRate(rate, trigger);
    this.dispatch('change', { detail: rate, trigger });
  }
}

export interface SpeedRadioGroupProps {
  /** The playback rate options to be displayed. */
  rates: number[];
  /** The text to display for normal speed (i.e., playback rate of 1). */
  normalLabel: string;
}

export interface SpeedRadioGroupEvents {
  change: SpeedRadioGroupChangeEvent;
}

/**
 * Fired when the checked radio changes.
 *
 * @detail speed
 */
export interface SpeedRadioGroupChangeEvent extends DOMEvent<number> {
  target: SpeedRadioGroup;
}
