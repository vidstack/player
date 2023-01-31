import type { HTMLCustomElement } from 'maverick.js/element';

export interface ToggleButtonProps {
  /**
   * Whether the underlying button should be disabled (non-interactive).
   *
   * @signal
   */
  disabled: boolean;
  /**
   * Whether it should start in the on (pressed) state. This prop is only available on the base
   * `<media-toggle-button>`.
   */
  defaultPressed: boolean;
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

/**
 * A toggle button is a two-state button that can be either off (not pressed) or on (pressed).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/toggle-button}
 * @slot - Used to passing in content for showing pressed and not pressed states.
 * @example
 * ```html
 * <media-toggle-button aria-label="...">
 *   <svg slot="pressed">...</svg>
 *   <svg slot="not-pressed">...</svg>
 * </media-toggle-button>
 * ```
 */
export interface ToggleButtonElement
  extends HTMLCustomElement<ToggleButtonProps, ToggleButtonEvents>,
    ToggleButtonMembers {}
