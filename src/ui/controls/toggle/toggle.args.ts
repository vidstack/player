export interface ToggleProps {
  /**
   * Whether the toggle is in the `on` state.
   */
  on: boolean;
}

export type ToggleStorybookArgs = {
  [P in keyof ToggleProps]: unknown;
};

export const TOGGLE_STORYBOOK_ARG_TYPES: ToggleStorybookArgs = {
  on: {
    control: 'boolean',
    defaultValue: false,
  },
};
