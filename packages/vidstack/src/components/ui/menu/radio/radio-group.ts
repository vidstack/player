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

  private _controller: RadioGroupController;

  /**
   * A list of radio values that belong this group.
   */
  @prop
  get values(): string[] {
    return this._controller._values;
  }

  /**
   * The radio value that is checked in this group.
   */
  @prop
  get value() {
    return this._controller.value;
  }

  set value(newValue) {
    this._controller.value = newValue;
  }

  constructor() {
    super();
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }

  protected override onSetup(): void {
    if (__SERVER__) this._watchValue();
    else effect(this._watchValue.bind(this));
  }

  private _watchValue() {
    this._controller.value = this.$props.value();
  }

  private _onValueChange(value: string, trigger?: Event) {
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
