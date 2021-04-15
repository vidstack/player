export const BUTTON_ELEMENT_TAG_NAME = `button`;

export type ButtonType = 'button' | 'submit' | 'reset' | 'menu';

export interface ButtonElementProps {
  /**
   * ♿ **ARIA:** The `aria-label` property of the button.
   */
  label?: string;

  /**
   * ♿ **ARIA:** Identifies the element (or elements) whose contents or presence are controlled by
   * the current button. See related `aria-owns`.
   */
  controls?: string;

  /**
   * Indicates the availability and type of interactive popup element, such as menu or dialog,
   * that can be triggered by the button.
   */
  hasPopup?: boolean;

  /**
   * Whether the button should be hidden.
   */
  hidden: boolean;

  /**
   * Whether the button should be disabled (not-interactable).
   */
  disabled: boolean;

  /**
   * Sets the default behaviour of the button.
   *
   * - `submit`: The button submits the form data to the server. This is the default if the
   * attribute is not specified for buttons associated with a <form>, or if the attribute is an
   * empty or invalid value.
   *
   * - `reset`: The button resets all the controls to their initial values,
   * like `<input type="reset">`. (This behavior tends to annoy users.)
   *
   * - `button`: The button has no default behavior, and does nothing when pressed by default. It
   * can have client-side scripts listen to the element's events, which are triggered when the
   * events occur.
   */
  type: ButtonType;

  /**
   * ♿ **ARIA:** Indicates whether the button, or another grouping element it controls, is
   * currently expanded or collapsed.
   */
  expanded?: boolean;

  /**
   * ♿ **ARIA:** Indicates the current "pressed" state of toggle buttons. See related `aria-checked`
   * and `aria-selected`.
   */
  pressed?: boolean;

  /**
   * ♿ **ARIA:** Identifies the element (or elements) that describes the button. See related
   * `aria-labelledby`.
   */
  describedBy?: string;

  /**
   * The component's root element.
   *
   * @default HTMLButtonElement
   */
  readonly rootElement: HTMLButtonElement;
}
