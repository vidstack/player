import { Component, effect, prop } from 'maverick.js';
import type { DOMEvent } from 'maverick.js/std';

import { RadioGroupController } from './radio-group-controller';

/**
 * A radio group consists of options where only one of them can be checked. Each option is
 * provided as a radio (i.e., a selectable element).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/menu/radio-group}
 */
export class RadioGroup extends Component<RadioGroupProps, {}, RadioGroupEvents> {
  static props: RadioGroupProps = {
    value: '',
  };

  #controller: RadioGroupController;

  /**
   * A list of radio values that belong this group.
   */
  @prop
  get values(): string[] {
    return this.#controller.values;
  }

  /**
   * The radio value that is checked in this group.
   */
  @prop
  get value() {
    return this.#controller.value;
  }

  set value(newValue) {
    this.#controller.value = newValue;
  }

  constructor() {
    super();
    this.#controller = new RadioGroupController();
    this.#controller.onValueChange = this.#onValueChange.bind(this);
  }

  protected override onSetup(): void {
    if (__SERVER__) this.#watchValue();
    else effect(this.#watchValue.bind(this));
  }

  #watchValue() {
    this.#controller.value = this.$props.value();
  }

  #onValueChange(value: string, trigger?: Event) {
    const event = this.createEvent('change', { detail: value, trigger });
    this.dispatch(event);
  }
}

export interface RadioGroupProps {
  /**
   * The value of the radio that is checked in this group.
   */
  value: string;
}

export interface RadioGroupEvents {
  change: RadioGroupChangeEvent;
}

/**
 * Fired when the checked radio changes.
 *
 * @detail value
 */
export interface RadioGroupChangeEvent extends DOMEvent<string> {
  target: RadioGroup;
}
