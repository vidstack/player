import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import type {
  MediaController,
  MediaControllerEvents,
  MediaControllerProps,
} from './controller/types';

export interface MediaElementProps extends MediaControllerProps {}

export interface MediaElementEvents extends MediaControllerEvents {
  'media-connect': MediaConnectEvent;
  /** @internal */
  'vds-find-media': FindMediaEvent;
}

export interface MediaElementMembers extends MediaElementProps, MediaController {}

/**
 * Fired when the media element `<vds-media>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export interface MediaConnectEvent extends DOMEvent<MediaElement> {}

export interface FindMediaEventDetail {
  (element: MediaElement | null): void;
}

/** @internal @bubbles @composed */
export interface FindMediaEvent extends DOMEvent<FindMediaEventDetail> {}

export interface MediaElementCSSVars {
  /**
   * The amount of media that has buffered in seconds (0 -> duration).
   */
  readonly 'media-buffered-amount': number;
  /**
   * The current playback time in seconds (0 -> duration).
   */
  readonly 'media-current-time': number;
  /**
   * The total length of media in seconds.
   */
  readonly 'media-duration': number;
  /**
   * The amount of media that is seekable in seconds (0 -> duration).
   */
  readonly 'media-seekable-amount': number;
}

/**
 * All media elements exist inside the `<vds-media>` component. This component's main
 * responsibilities are to manage media state updates, dispatch media events, handle media
 * requests, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/layout/media}
 * @slot - Used to pass in media components.
 * @example
 * ```html
 * <vds-media>
 *   <vds-video>
 *     <video src="..." />
 *   </vds-video>
 *
 *   <!-- Other components that use/manage media state here. -->
 * </vds-media>
 * ```
 */
export interface MediaElement
  extends HTMLCustomElement<MediaElementProps, MediaElementEvents, MediaElementCSSVars>,
    MediaElementMembers {}
