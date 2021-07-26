import { VdsEvent } from '@base/events/index.js';

/**
 * @typedef {{
 *  'vds-hls-load': HlsLoadEvent;
 *  'vds-hls-load-error': HlsLoadErrorEvent;
 *  'vds-hls-build': HlsBuildEvent;
 *  'vds-hls-attach': HlsAttachEvent;
 *  'vds-hls-detach': HlsDetachEvent;
 *  'vds-hls-no-support': HlsNoSupportEvent;
 * }} HlsEvents
 */

/**
 * Fired when the `hls.js` library has been loaded. This will not fire if you're bundling it
 * locally OR if it's been cached already.
 *
 * @event
 * @typedef {VdsEvent<typeof import('hls.js')>} HlsLoadEvent
 */

/**
 * Fired when the `hls.js` library fails to load from a remote source given via `hlsLibrary`.
 *
 * @event
 * @typedef {VdsEvent<Error>} HlsLoadErrorEvent
 */

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 *
 * @event
 * @typedef {VdsEvent<import('hls.js')>} HlsBuildEvent
 */

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 *
 * @event
 * @typedef {VdsEvent<import('hls.js')>} HlsAttachEvent
 */

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 *
 * @event
 * @typedef {VdsEvent<import('hls.js')>} HlsDetachEvent
 */

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 *
 * @event
 * @typedef {VdsEvent<void>} HlsNoSupportEvent
 */
