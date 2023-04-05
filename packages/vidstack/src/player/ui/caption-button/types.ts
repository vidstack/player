import type { HTMLCustomElement } from 'maverick.js/element';

import type {
  ToggleButtonEvents,
  ToggleButtonMembers,
  ToggleButtonProps,
} from '../toggle-button/types';

export interface CaptionButtonProps extends ToggleButtonProps {}

export interface CaptionButtonEvents extends ToggleButtonEvents {}

export interface CaptionButtonMembers
  extends ToggleButtonMembers,
    Omit<CaptionButtonProps, 'disabled'> {}

/**
 * A button for toggling the showing state of the captions.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/buttons/caption-button}
 * @slot on - Used to override the default caption on icon.
 * @slot off - Used to override the default caption off icon.
 * @slot tooltip-top-left - Used to place a tooltip above the button in the left corner.
 * @slot tooltip-top-center - Used to place a tooltip above the button in the center.
 * @slot tooltip-top-right - Used to place a tooltip above the button in the right corner.
 * @slot tooltip-bottom-left - Used to place a tooltip below the button in the left corner.
 * @slot tooltip-bottom-center - Used to place a tooltip below the button in the center.
 * @slot tooltip-bottom-right - Used to place a tooltip below the button in the right corner.
 * @example
 * ```html
 * <media-caption-button></media-caption-button>
 * ```
 */
export interface MediaCaptionButtonElement
  extends HTMLCustomElement<CaptionButtonProps, CaptionButtonEvents>,
    CaptionButtonMembers {}
