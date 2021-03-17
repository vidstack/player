import {
  VdsBufferingIndicatorHideEvent,
  VdsBufferingIndicatorShowEvent,
} from './buffering-indicator.events';
import {
  BufferingIndicatorActions,
  BufferingIndicatorFakeProps,
  BufferingIndicatorProps,
} from './buffering-indicator.types';

export type BufferingIndicatorStorybookArgs = {
  [P in keyof (BufferingIndicatorProps &
    BufferingIndicatorFakeProps &
    BufferingIndicatorActions)]: unknown;
};

export const BUFFERING_INDICATOR_STORYBOOK_ARG_TYPES: BufferingIndicatorStorybookArgs = {
  delay: {
    control: 'number',
    delay: 0,
  },
  showWhileBooting: {
    control: 'boolean',
    defaultValue: false,
  },
  fakeBuffering: {
    control: 'boolean',
    defaultValue: true,
  },
  onShow: {
    action: VdsBufferingIndicatorShowEvent.TYPE,
  },
  onHide: {
    action: VdsBufferingIndicatorHideEvent.TYPE,
  },
};
