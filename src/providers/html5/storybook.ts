import { StorybookControl } from '../../base/storybook';
import { MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES } from '../../media/provider/storybook';

export const HTML5_MEDIA_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES,
  controlsList: { control: StorybookControl.Text },
  crossOrigin: { control: StorybookControl.Text },
  defaultMuted: { control: StorybookControl.Boolean },
  defaultPlaybackRate: { control: StorybookControl.Number },
  disableRemotePlayback: { control: StorybookControl.Boolean },
  height: { control: StorybookControl.Number },
  preload: { control: StorybookControl.Text },
  srcObject: { control: StorybookControl.Text },
  width: { control: StorybookControl.Number }
};
