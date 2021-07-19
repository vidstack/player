import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import { MediaContainerConnectEvent } from './MediaContainerElement.js';

export const MEDIA_CONTAINER_ELEMENT_STORYBOOK_ARG_TYPES = {
  aspectRatio: { control: StorybookControl.Text },
  onMediaContainerConnect: storybookAction(MediaContainerConnectEvent.TYPE)
};
