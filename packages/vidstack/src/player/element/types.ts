import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import type {
  MediaController,
  MediaControllerEvents,
  MediaControllerProps,
} from '../media/controller/types';
import type { MediaKeyShortcuts, MediaKeyTarget } from '../media/types';

export interface MediaPlayerProps extends MediaControllerProps {
  /**
   * The aspect ratio of the player media given as 'width/height' (e.g., 16/9).
   */
  aspectRatio: number | null;
  /**
   * Whether keyboard support is disabled for the media player globally. This property won't disable
   * standard ARIA keyboard controls for individual components when focused.
   *
   * @defaultValue 'false'
   */
  keyDisabled: boolean;
  /**
   * The target on which to listen for keyboard events (e.g., `keydown`):
   *
   * - `document`: the player will listen for events on the entire document. In the case that
   * multiple players are on the page, only the most recently active player will receive input.
   * - `player`: the player will listen for events on the player itself or one of its children
   * were recently interacted with.
   *
   * @defaultValue `player`
   */
  keyTarget: MediaKeyTarget;
  /**
   * Extends global media player keyboard shortcuts. The shortcuts can be specified as a
   * space-separated list of combinations (e.g., `p Control+Space`), see the provided doc link
   * for more information.
   *
   * Do note, if `aria-keyshortcuts` is specified on a component then it will take precedence
   * over the respective value set here.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts}
   * @example
   * ```js
   * keyShortcuts = {
   *   togglePaused: 'k Space',
   *   toggleMuted: 'm',
   *   toggleFullscreen: 'f',
   *   togglePictureInPicture: 'i',
   *   seekBackward: 'ArrowLeft',
   *   seekForward: 'ArrowRight',
   *   volumeUp: 'ArrowUp',
   *   volumeDown: 'ArrowDown',
   * }
   * ```
   */
  keyShortcuts: MediaKeyShortcuts;
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
   * The latest time in seconds for which media has been buffered (i.e., downloaded by the
   * browser).
   */
  readonly 'media-buffered': number;
  /**
   * The current playback time in seconds (0 -> duration).
   */
  readonly 'media-current-time': number;
  /**
   * The total length of media in seconds.
   */
  readonly 'media-duration': number;
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
