import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import type {
  MediaController,
  MediaControllerEvents,
  MediaControllerProps,
} from '../media/controller/types';
import type { MediaResource } from '../media/types';

export interface MediaPlayerProps extends MediaControllerProps {
  /**
   * The URL and optionally type of the current media resource/s to be considered for playback.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/src}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject}
   */
  src:
    | MediaResource
    | { src: MediaResource; type?: string }
    | { src: MediaResource; type?: string }[];
  /**
   * The aspect ratio of the player media given as 'width/height' (e.g., 16/9).
   */
  aspectRatio: number | null;
}

export interface MediaPlayerEvents extends MediaControllerEvents {
  'media-player-connect': MediaPlayerConnectEvent;
  /** @internal */
  'find-media-player': FindMediaPlayerEvent;
}

export interface MediaPlayerMembers extends MediaPlayerProps, MediaController {}

/**
 * Fired when the player element `<media-player>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export interface MediaPlayerConnectEvent extends DOMEvent<MediaPlayerElement> {}

export interface FindMediaPlayerEventDetail {
  (player: MediaPlayerElement | null): void;
}

/** @internal @bubbles @composed */
export interface FindMediaPlayerEvent extends DOMEvent<FindMediaPlayerEventDetail> {}

export interface MediaElementCSSVars {
  /**
   * The minimum height of the player when an aspect ratio is applied.
   */
  'media-min-height'?: number;
  /**
   * The maximum height of the player when an aspect ratio is applied.
   */
  'media-max-height'?: number;
  /**
   * The current aspect ratio of the player media.
   */
  readonly 'media-aspect-ratio': number | null;
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
 * All media elements exist inside the `<media-player>` component. This component's main
 * responsibilities are to manage media state updates, dispatch media events, handle media
 * requests, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/layout/player}
 * @slot - Used to pass in media components.
 * @example
 * ```html
 * <media-player src="...">
 *   <media-outlet></media-outlet>
 *   <!-- Other components that use/manage media state here. -->
 * </media-player>
 * ```
 */
export interface MediaPlayerElement
  extends HTMLCustomElement<MediaPlayerProps, MediaPlayerEvents, MediaElementCSSVars>,
    MediaPlayerMembers {}
