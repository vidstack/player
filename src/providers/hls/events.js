import Hls from 'hls.js';

import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *  [HlsEngineBuiltEvent.TYPE]: HlsEngineBuiltEvent;
 *  [HlsEngineDetachEvent.TYPE]: HlsEngineDetachEvent;
 *  [HlsEngineAttachEvent.TYPE]: HlsEngineAttachEvent;
 *  [HlsEngineNoSupportEvent.TYPE]: HlsEngineNoSupportEvent;
 * }} HlsEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class HlsEvent extends VdsCustomEvent {}

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 *
 * @augments {HlsEvent<Hls>}
 */
export class HlsEngineBuiltEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-engine-built';
}

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 *
 * @augments {HlsEvent<Hls>}
 */
export class HlsEngineAttachEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-engine-attach';
}

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 *
 * @augments {HlsEvent<Hls>}
 */
export class HlsEngineDetachEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-engine-detach';
}

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 *
 * @augments {HlsEvent<void>}
 */
export class HlsEngineNoSupportEvent extends HlsEvent {
  /** @readonly */
  static TYPE = 'vds-hls-engine-no-support';
}
