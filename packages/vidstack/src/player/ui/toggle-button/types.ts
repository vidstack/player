import type { HTMLCustomElement } from 'maverick.js/element';

import type { MediaButtonProps } from '../button/types';

export interface ToggleButtonProps extends MediaButtonProps {
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

export interface ToggleButtonMembers {
  /**
   * Whether the underlying button is disabled (non-interactive).
   *
   * @signal
   */
  readonly disabled: boolean;
  /**
   * Whether the toggle is currently in a `pressed` state.
   *
   * @signal
   */
  readonly pressed: boolean;
}

/**
 * A toggle button is a two-state button that can be either off (not pressed) or on (pressed).
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/toggle-button}
 * @slot - Used to passing in content for showing pressed and not pressed states.
 * @slot tooltip-top-left - Used to place a tooltip above the button in the left corner.
 * @slot tooltip-top-center - Used to place a tooltip above the button in the center.
 * @slot tooltip-top-right - Used to place a tooltip above the button in the right corner.
 * @slot tooltip-bottom-left - Used to place a tooltip below the button in the left corner.
 * @slot tooltip-bottom-center - Used to place a tooltip below the button in the center.
 * @slot tooltip-bottom-right - Used to place a tooltip below the button in the right corner.
 * @example
 * ```html
 * <media-toggle-button aria-label="...">
 *   <svg slot="on">...</svg>
 *   <svg slot="off">...</svg>
 * </media-toggle-button>
 * ```
 */
export interface MediaToggleButtonElement
  extends HTMLCustomElement<ToggleButtonProps, ToggleButtonEvents>,
    ToggleButtonMembers {}
