import { ButtonElement } from '../button';
import { ToggleElementProps } from '../toggle/toggle.types';

export const TOGGLE_BUTTON_ELEMENT_TAG_NAME = `toggle-button`;

export interface ToggleButtonElementProps extends ToggleElementProps {
  /**
   * Whether the underlying button should be disabled (not-interactable).
   */
  disabled: boolean;

  /**
   * ♿ **ARIA:** Identifies the element (or elements) that describes the underlying button.
   */
  describedBy?: string;

  /**
   * ♿ **ARIA:** The `aria-label` property of the underlying button.
   *
   * @required
   */
  label?: string;

  /**
   * The component's root element.
   *
   * @default ButtonElement
   */
  readonly rootElement: ButtonElement;
}
