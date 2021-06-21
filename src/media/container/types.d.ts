import { FullscreenHost } from '../../shared/fullscreen/index.js';
import { ScreenOrientationHost } from '../../shared/screen-orientation.js';
import {
	StorybookArgs,
	StorybookArgTypes
} from '../../shared/storybook/index.js';
import { VdsMediaContainerEvents } from './events.js';

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
	VdsMediaContainerEvents
>;

export type MediaContainerElementStorybookArgs = StorybookArgs<
	MediaContainerElementProps,
	VdsMediaContainerEvents
>;
