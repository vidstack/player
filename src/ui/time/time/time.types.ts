export const TIME_ELEMENT_TAG_NAME = `time`;

export interface TimeElementProps {
  /**
   * ♿ **ARIA:** The `aria-label` property of the time.
   */
  label?: string;

  /**
   * The length of time in seconds.
   */
  seconds: number;

  /**
   * Whether the time should always show the hours unit, even if the time is less than
   * 1 hour.
   *
   * @example `20:30` -> `0:20:35`
   */
  alwaysShowHours: boolean;

  /**
   * Whether the hours unit should be padded with zeroes to a length of 2.
   *
   * @example `1:20:03` -> `01:20:03`
   */
  padHours: boolean;

  /**
   * The component's root element.
   *
   * @default HTMLTimeElement
   */
  readonly rootElement: HTMLTimeElement;
}
