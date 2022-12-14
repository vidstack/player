import type { HTMLCustomElement } from 'maverick.js/element';
import type { DOMEvent } from 'maverick.js/std';

import type { LogLevel } from '../../../foundation/logger/log-level';
import type { ScreenOrientationLockType } from '../../../foundation/orientation/screen-orientation';
import type { MediaControllerEvents } from '../controller/events';
import type { UseMediaController } from '../controller/use-media-controller';

/**
 * All media elements exist inside the `<vds-media>` component. It's main jobs are to host the
 * media controller, and expose media state through HTML attributes and CSS properties for styling
 * purposes.
 *
 * @tagname vds-media
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
  extends HTMLCustomElement<MediaElementProps, MediaElementEvents>,
    MediaElementMembers {}

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

export interface MediaElementMembers extends MediaElementProps, UseMediaController {}

export interface MediaElementEvents extends MediaControllerEvents {
  'vds-media-connect': MediaElementConnectEvent;
}

/**
 * Fired when the media element `<vds-media>` connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export interface MediaElementConnectEvent extends DOMEvent<MediaElement> {}
