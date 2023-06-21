import { Component, peek, signal } from 'maverick.js';
import { prop } from 'maverick.js';

import { Slots } from '../utils/slots';
import { ToggleButtonController } from './toggle-button-controller';

export interface ToggleButtonProps {
  /**
   * Whether it should start in the on (pressed) state.
   */
  defaultPressed: boolean;
  /**
   * Whether the button should be disabled (non-interactive).
   */
  disabled: boolean;
}

/**
 * A toggle button is a two-state button that can be either off (not pressed) or on (pressed).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/toggle-button}
 */
export class ToggleButton<
  Props extends ToggleButtonProps = ToggleButtonProps,
> extends Component<Props> {
  static props: ToggleButtonProps = {
    disabled: false,
    defaultPressed: false,
  };

  private _pressed = signal(false);

  /**
   * Whether the toggle is currently in a `pressed` state.
   */
  @prop
  get pressed() {
    return peek(this._pressed);
  }

  constructor() {
    super();
    new ToggleButtonController({
      _isPressed: this._pressed,
    });
  }

  protected override onSetup(): void {
    new Slots(() => {
      const isOn = this._pressed();
      return { on: !isOn, off: isOn };
    }).attach(this);
  }
}
