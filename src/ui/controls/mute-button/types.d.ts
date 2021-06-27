import { VdsMediaRequestEvents } from '../../../media/index.js';
import {
  StorybookArgs,
  StorybookArgTypes
} from '../../../shared/storybook/index.js';
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
  Pick<VdsMediaRequestEvents, 'vds-mute-request' | 'vds-unmute-request'>
>;

export type MuteButtonElementStorybookArgs = StorybookArgs<
  MuteButtonElementProps & MuteButtonElementMediaProps,
  Pick<VdsMediaRequestEvents, 'vds-mute-request' | 'vds-unmute-request'>
>;
