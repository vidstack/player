import { FullscreenHost } from '../../shared/fullscreen';
import { ScreenOrientationHost } from '../../shared/screen-orientation';

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
