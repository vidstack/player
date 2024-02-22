import { Component, effect, hasProvidedContext, method, prop, useContext } from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import { menuContext, type MenuContext } from '../menu-context';
import type { RadioOption } from '../radio/radio';
import { RadioGroupController } from '../radio/radio-group-controller';

export const DEFAULT_AUDIO_GAINS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];

/**
 * This component manages audio gain radios.
 *
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/audio-gain-radio-group}
 */
export class AudioGainRadioGroup extends Component<
  AudioGainRadioGroupProps,
  {},
  AudioGainRadioGroupEvents
> {
  static props: AudioGainRadioGroupProps = {
    normalLabel: 'Disabled',
    gains: DEFAULT_AUDIO_GAINS,
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
    const { gains } = this.$props,
      { canSetAudioGain } = this._media.$state;
    return !canSetAudioGain() || gains().length === 0;
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
    const { gains, normalLabel } = this.$props;
    return gains().map((gain) => ({
      label: gain === 1 || gain === null ? normalLabel : String(gain * 100) + '%',
      value: gain.toString(),
    }));
  }

  private _watchValue() {
    this._controller.value = this._getValue();
  }

  private _watchHintText() {
    const { normalLabel } = this.$props,
      { audioGain } = this._media.$state,
      gain = audioGain();
    this._menu?._hint.set(gain === 1 || gain == null ? normalLabel() : String(gain * 100) + '%');
  }

  private _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }

  private _getValue() {
    const { audioGain } = this._media.$state;
    return audioGain()?.toString() ?? '1';
  }

  private _onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;
    const gain = +value;
    this._media.remote.changeAudioGain(gain, trigger);
    this.dispatch('change', { detail: gain, trigger });
  }
}

export interface AudioGainRadioGroupProps {
  /** The audio gain options to be displayed. */
  gains: number[];
  /** The text to display for disabled audio gain (i.e., audio gain is 1.0). */
  normalLabel: string;
}

export interface AudioGainRadioGroupEvents {
  change: AudioGainRadioGroupChangeEvent;
}

/**
 * Fired when the checked radio changes.
 *
 * @detail gain
 */
export interface AudioGainRadioGroupChangeEvent extends DOMEvent<number> {
  target: AudioGainRadioGroup;
}
