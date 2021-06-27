import {
  StorybookArgs,
  StorybookArgTypes
} from '../../foundation/storybook/index.js';
import { MediaRequestEvents } from '../media-request.events.js';
import { MediaProviderElement } from '../provider/index.js';
import { MediaControllerElement } from './MediaControllerElement.js';

declare module './MediaControllerElement.js' {
  interface MediaControllerElement extends MediaProviderElement {}
}

export type MediaControllerElementStorybookArgTypes = StorybookArgTypes<
  {},
  MediaRequestEvents
>;

export type MediaControllerElementStorybookArgs = StorybookArgs<
  {},
  MediaRequestEvents
>;
