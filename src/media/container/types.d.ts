import { FullscreenHost } from '../../foundation/fullscreen/index.js';
import { ScreenOrientationHost } from '../../foundation/screen-orientation.js';
import {
  StorybookArgs,
  StorybookArgTypes
} from '../../foundation/storybook/index.js';
import { MediaContainerEvents } from './events.js';

export type MediaContainer = FullscreenHost &
  ScreenOrientationHost &
  MediaContainerElementProps;

export interface MediaContainerElementProps {
  /**
   * The aspect ratio of the container expressed as `width:height` (`16:9`). This is only applied if
   * the `viewType` is `video` and the media is not in fullscreen mode. Defaults to `undefined`.
   */
  aspectRatio: string | undefined;

  /**
   * The media container element.
   */
  readonly mediaContainerElement: HTMLDivElement;

  /**
   * The component's root element.
   */
  readonly rootElement: HTMLDivElement;
}

export type MediaContainerElementStorybookArgTypes = StorybookArgTypes<
  MediaContainerElementProps,
  MediaContainerEvents
>;

export type MediaContainerElementStorybookArgs = StorybookArgs<
  MediaContainerElementProps,
  MediaContainerEvents
>;
