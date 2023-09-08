import { Component, prop, signal } from 'maverick.js';

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
 * @attr data-pressed - Whether the toggle is in an "on" state (pressed).
 * @attr aria-pressed - Same as `data-pressed` but `"true"` or `"false"`.
 * @attr data-focus - Whether button is being keyboard focused.
 * @attr data-hocus - Whether button is being keyboard focused or hovered over.
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
    return this._pressed();
  }

  constructor() {
    super();
    new ToggleButtonController({
      _isPressed: this._pressed,
    });
  }
}
