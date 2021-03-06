export interface TimeProps {
  /**
   * ♿ **ARIA:** The `aria-label` property of the time.
   */
  label?: string;

  /**
   * The length of time in seconds.
   */
  duration: number;

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
}

export type TimeStorybookArgs = {
  [P in keyof TimeProps]: unknown;
};

export const TIME_STORYBOOK_ARG_TYPES: TimeStorybookArgs = {
  label: {
    control: 'text',
    defaultValue: '',
  },
  duration: {
    control: 'number',
    defaultValue: 3750,
  },
  alwaysShowHours: {
    control: 'boolean',
    defaultValue: false,
  },
  padHours: {
    control: 'boolean',
    defaultValue: false,
  },
};
