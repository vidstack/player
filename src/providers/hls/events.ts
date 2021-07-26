import { VdsEvent } from '@base/events/index';
import type Hls from 'hls.js';

export type HlsEvents = {
  'vds-hls-load': HlsLoadEvent;
  'vds-hls-load-error': HlsLoadErrorEvent;
  'vds-hls-build': HlsBuildEvent;
  'vds-hls-attach': HlsAttachEvent;
  'vds-hls-detach': HlsDetachEvent;
  'vds-hls-no-support': HlsNoSupportEvent;
};

/**
 * Fired when the `hls.js` library has been loaded. This will not fire if you're bundling it
 * locally OR if it's been cached already.
 *
 * @event
 */
export type HlsLoadEvent = VdsEvent<typeof Hls>;

/**
 * Fired when the `hls.js` library fails to load from a remote source given via `hlsLibrary`.
 *
 * @event
 */
export type HlsLoadErrorEvent = VdsEvent<Error>;

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 *
 * @event
 */
export type HlsBuildEvent = VdsEvent<Hls>;

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 *
 * @event
 */
export type HlsAttachEvent = VdsEvent<Hls>;

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 *
 * @event
 */
export type HlsDetachEvent = VdsEvent<Hls>;

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 *
 * @event
 */
export type HlsNoSupportEvent = VdsEvent<void>;
