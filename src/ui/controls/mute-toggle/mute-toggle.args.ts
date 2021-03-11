export interface MuteToggleProps {
  /**
   * ♿ **ARIA:** The `aria-label` property of the underlying playback control.
   *
   * @required
   */
  label?: string;

  /**
   * Whether the underlying control should be disabled (not-interactable).
   */
  disabled: boolean;

  /**
   * ♿ **ARIA:** Identifies the element (or elements) that describes the underlying control.
   */
  describedBy?: string;
}

export interface MuteToggleFakeProps {
  fakeMuted: boolean;
}

export type MuteToggleStorybookArgs = {
  [P in keyof (MuteToggleProps & MuteToggleFakeProps)]: unknown;
};

export const MUTE_TOGGLE_STORYBOOK_ARG_TYPES: MuteToggleStorybookArgs = {
  label: {
    control: 'text',
  },
  describedBy: {
    control: 'text',
  },
  disabled: {
    control: 'boolean',
    defaultValue: false,
  },
  fakeMuted: {
    control: 'boolean',
    defaultValue: false,
  },
};
