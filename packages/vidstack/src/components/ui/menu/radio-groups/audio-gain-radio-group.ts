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

  #media!: MediaContext;
  #menu?: MenuContext;
  #controller: RadioGroupController;

  @prop
  get value() {
    return this.#controller.value;
  }

  @prop
  get disabled() {
    const { gains } = this.$props,
      { canSetAudioGain } = this.#media.$state;
    return !canSetAudioGain() || gains().length === 0;
  }

  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }

  protected override onSetup(): void {
    this.#media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.#menu = useContext(menuContext);
    }
  }

  protected override onConnect(el: HTMLElement) {
    effect(this.#watchValue.bind(this));
    effect(this.#watchHintText.bind(this));
    effect(this.#watchControllerDisabled.bind(this));
  }

  @method
  getOptions(): RadioOption[] {
    const { gains, normalLabel } = this.$props;
    return gains().map((gain) => ({
      label: gain === 1 || gain === null ? normalLabel : String(gain * 100) + '%',
      value: gain.toString(),
    }));
  }

  #watchValue() {
    this.#controller.value = this.#getValue();
  }

  #watchHintText() {
    const { normalLabel } = this.$props,
      { audioGain } = this.#media.$state,
      gain = audioGain();
    this.#menu?.hint.set(gain === 1 || gain == null ? normalLabel() : String(gain * 100) + '%');
  }

  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }

  #getValue() {
    const { audioGain } = this.#media.$state;
    return audioGain()?.toString() ?? '1';
  }

  #onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;
    const gain = +value;
    this.#media.remote.changeAudioGain(gain, trigger);
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
