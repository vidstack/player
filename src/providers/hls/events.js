import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *  [HlsLoadEvent.TYPE]: HlsLoadEvent;
 *  [HlsLoadErrorEvent.TYPE]: HlsLoadErrorEvent;
 *  [HlsBuildEvent.TYPE]: HlsBuildEvent;
 *  [HlsDetachEvent.TYPE]: HlsDetachEvent;
 *  [HlsAttachEvent.TYPE]: HlsAttachEvent;
 *  [HlsNoSupportEvent.TYPE]: HlsNoSupportEvent;
 * }} HlsEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class HlsEvent extends VdsCustomEvent {}

/**
 * Fired when the `hls.js` library has been loaded. This will not fire if you're bundling it
 * locally OR if it's been cached already.
 *
 * @augments {HlsEvent<typeof import('hls.js')>}
 */
export class HlsLoadEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-load';
}

/**
 * Fired when the `hls.js` library fails to load from a remote source given via `hlsLibrary`.
 *
 * @augments {HlsEvent<Error>}
 */
export class HlsLoadErrorEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-load-error';
}

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 *
 * @augments {HlsEvent<import('hls.js')>}
 */
export class HlsBuildEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-build';
}

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 *
 * @augments {HlsEvent<import('hls.js')>}
 */
export class HlsAttachEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-attach';
}

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 *
 * @augments {HlsEvent<import('hls.js')>}
 */
export class HlsDetachEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-detach';
}

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 *
 * @augments {HlsEvent<void>}
 */
export class HlsNoSupportEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-no-support';
}
