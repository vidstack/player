import { MediaRequestEvents } from '../../../media/index.js';
import {
  StorybookArgs,
  StorybookArgTypes
} from '../../../shared/storybook/index.js';
import { ToggleButtonElementProps } from '../toggle-button/index.js';

export type PlayButton = ToggleButtonElementProps;

export type PlayButtonElementProps = ToggleButtonElementProps & {
  /**
   * The `play` slotted element.
   */
  readonly playSlotElement: HTMLElement | undefined;

  /**
   * The `pause` slotted element.
   */
  readonly pauseSlotElement: HTMLElement | undefined;
};

export interface PlayButtonElementMediaProps {
  mediaPaused: boolean;
}

export type PlayButtonElementStorybookArgTypes = StorybookArgTypes<
  PlayButtonElementProps & PlayButtonElementMediaProps,
  Pick<MediaRequestEvents, 'vds-play-request' | 'vds-pause-request'>
>;

export type PlayButtonElementStorybookArgs = StorybookArgs<
  PlayButtonElementProps & PlayButtonElementMediaProps,
  Pick<MediaRequestEvents, 'vds-play-request' | 'vds-pause-request'>
>;
