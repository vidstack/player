import { Component, effect, hasProvidedContext, method, prop, useContext } from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import { useMediaContext, type MediaContext } from '../../../../core/api/media-context';
import { menuContext, type MenuContext } from '../menu-context';
import type { RadioOption } from '../radio/radio';
import { RadioGroupController } from '../radio/radio-group-controller';

export const DEFAULT_PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

/**
 * This component manages playback rate radios.
 *
 * @docs {@link https://www.vidstack.io/docs/wc/player/components/menu/speed-radio-group}
 */
export class SpeedRadioGroup extends Component<SpeedRadioGroupProps, {}, SpeedRadioGroupEvents> {
  static props: SpeedRadioGroupProps = {
    normalLabel: 'Normal',
    rates: DEFAULT_PLAYBACK_RATES,
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
    const { rates } = this.$props,
      { canSetPlaybackRate } = this.#media.$state;
    return !canSetPlaybackRate() || rates().length === 0;
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
    const { rates, normalLabel } = this.$props;
    return rates().map((rate) => ({
      label: rate === 1 ? normalLabel : rate + '×',
      value: rate.toString(),
    }));
  }

  #watchValue() {
    this.#controller.value = this.#getValue();
  }

  #watchHintText() {
    const { normalLabel } = this.$props,
      { playbackRate } = this.#media.$state,
      rate = playbackRate();
    this.#menu?.hint.set(rate === 1 ? normalLabel() : rate + '×');
  }

  #watchControllerDisabled() {
    this.#menu?.disable(this.disabled);
  }

  #getValue() {
    const { playbackRate } = this.#media.$state;
    return playbackRate().toString();
  }

  #onValueChange(value: string, trigger?: Event) {
    if (this.disabled) return;
    const rate = +value;
    this.#media.remote.changePlaybackRate(rate, trigger);
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
