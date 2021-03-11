export interface PlaybackToggleProps {
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

export interface PlaybackToggleFakeProps {
  fakePaused: boolean;
}

export type PlaybackToggleStorybookArgs = {
  [P in keyof (PlaybackToggleProps & PlaybackToggleFakeProps)]: unknown;
};

export const PLAYBACK_TOGGLE_STORYBOOK_ARG_TYPES: PlaybackToggleStorybookArgs = {
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
  fakePaused: {
    control: 'boolean',
    defaultValue: true,
  },
};
