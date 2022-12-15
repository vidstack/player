import type { HTMLCustomElement } from 'maverick.js/element';

export interface ToggleButtonElement
  extends HTMLCustomElement<ToggleButtonProps, ToggleButtonEvents>,
    ToggleButtonMembers {}

export interface ToggleButtonProps {
  /**
   * Whether the underlying button should be disabled (non-interactive).
   *
   * @signal
   */
  disabled: boolean;
}

export interface ToggleButtonEvents {}

export interface ToggleButtonMembers extends ToggleButtonProps {
  /**
   * Whether the toggle is currently in a `pressed` state.
   *
   * @signal
   */
  pressed: boolean;
}
