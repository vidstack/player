import { Callback } from '../../shared/types';
import {
  BufferingIndicatorHideEvent,
  BufferingIndicatorShowEvent,
} from './buffering-indicator.events';

export interface BufferingIndicatorProps {
  /**
   * Whether the indicator should be shown while the provider/media is booting, in other words
   * before it's ready for playback (`isPlaybackReady === false`).
   */
  showWhileBooting: boolean;

  /**
   * Delays the showing of the buffering indicator in the hopes that it resolves itself within
   * that delay. This can be helpful in avoiding unnecessary or fast flashing indicators that
   * may stress the user out. The delay number is in milliseconds.
   *
   * @example `300` => 300 milliseconds
   */
  delay: number;
}

export interface BufferingIndicatorFakeProps {
  fakeBuffering: boolean;
}

export interface BufferingIndicatorActions {
  onShow: Callback<CustomEvent>;
  onHide: Callback<CustomEvent>;
}

export type BufferingIndicatorStorybookArgs = {
  [P in keyof (BufferingIndicatorProps &
    BufferingIndicatorFakeProps &
    BufferingIndicatorActions)]: unknown;
};

export const BUFFERING_INDICATOR_STORYBOOK_ARG_TYPES: BufferingIndicatorStorybookArgs = {
  showWhileBooting: {
    control: 'boolean',
    defaultValue: false,
  },
  delay: {
    control: 'number',
    delay: 0,
  },
  fakeBuffering: {
    control: 'boolean',
    defaultValue: true,
  },
  onShow: {
    action: BufferingIndicatorShowEvent.TYPE,
  },
  onHide: {
    action: BufferingIndicatorHideEvent.TYPE,
  },
};
