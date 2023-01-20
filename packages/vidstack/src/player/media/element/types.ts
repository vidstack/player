import type { Dispose, MaybeStopEffect } from 'maverick.js';
import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import type { LogLevel } from '../../../foundation/logger/log-level';
import type { ScreenOrientationLockType } from '../../../foundation/orientation/screen-orientation';
import type { MediaControllerEvents } from '../controller/events';
import type { UseMediaController } from '../controller/use-media-controller';
import type { MediaProviderElement } from '../provider/types';
import type { MediaState } from '../state';
import type { MediaStore } from '../store';

export interface MediaElementProps {
  /**
   * The current log level. Values in order of priority are: `silent`, `error`, `warn`, `info`,
   * and `debug`.
   */
  logLevel: LogLevel;
  /**
   * The amount of delay in milliseconds while media playback is progressing without user
   * activity to indicate an idle state.
   */
  userIdleDelay: number;
  /**
   * This will indicate the orientation to lock the screen to when in fullscreen mode and
   * the Screen Orientation API is available. The default is `undefined` which indicates
   * no screen orientation change.
   */
  fullscreenOrientation: ScreenOrientationLockType | undefined;
}

export interface MediaElementMembers extends MediaElementProps, UseMediaController {
  /** @internal */
  readonly $store: MediaStore;
  /**
   * The current media provider element.
   */
  readonly provider: MediaProviderElement | null;
  /**
   * This object contains all current media state (e.g., `paused`, `playing`, etc.).
   */
  readonly state: Readonly<MediaState>;
  /**
   * Enables subscribing to live updates of individually selected media state.
   *
   * @example
   * ```ts
   * const media = document.querySelector('vds-media');
   * media.store.paused.subscribe(paused => {
   *   // ...
   * });
   * ```
   */
  readonly store: MediaElementStore;
}

export type MediaElementStore = {
  readonly [Prop in keyof MediaStore]: Subscribable<MediaStore[Prop]>;
};

export interface Subscribable<Value> {
  subscribe(callback: (value: Value) => MaybeStopEffect): Dispose;
}

export interface MediaElementEvents extends MediaControllerEvents {
  'media-connect': MediaConnectEvent;
}

/**
 * Fired when the media element `<vds-media>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export interface MediaConnectEvent extends DOMEvent<MediaElement> {}

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
 * All media elements exist inside the `<vds-media>` component. It's main jobs are to host the
 * media controller, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @docs {@link https://www.vidstack.io/docs/player/components/layout/media}
 * @slot - Used to pass in components that use/manage/provide media state.
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
