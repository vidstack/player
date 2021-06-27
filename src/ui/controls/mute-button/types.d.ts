import { MediaRequestEvents } from '../../../media/index.js';
import {
  StorybookArgs,
  StorybookArgTypes
} from '../../../foundation/storybook/index.js';
import { ToggleButtonElementProps } from '../toggle-button/index.js';

export type MuteButton = MuteButtonElementProps;

export type MuteButtonElementProps = ToggleButtonElementProps & {
  /**
   * The `mute` slotted element.
   */
  readonly muteSlotElement: HTMLElement | undefined;

  /**
   * The `unmute` slotted element.
   */
  readonly unmuteSlotElement: HTMLElement | undefined;
};

export interface MuteButtonElementMediaProps {
  mediaMuted: boolean;
}

export type MuteButtonElementStorybookArgTypes = StorybookArgTypes<
  MuteButtonElementProps & MuteButtonElementMediaProps,
  Pick<MediaRequestEvents, 'vds-mute-request' | 'vds-unmute-request'>
>;

export type MuteButtonElementStorybookArgs = StorybookArgs<
  MuteButtonElementProps & MuteButtonElementMediaProps,
  Pick<MediaRequestEvents, 'vds-mute-request' | 'vds-unmute-request'>
>;
