import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';

export const MEDIA_CONTAINER_ELEMENT_STORYBOOK_ARG_TYPES = {
  aspectRatio: { control: StorybookControl.Text },
  onMediaContainerConnect: storybookAction('vds-media-container-connect')
};
