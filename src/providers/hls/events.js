import { VdsCustomEvent } from '../../shared/events/index.js';

export class HlsEvent extends VdsCustomEvent {}

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 */
export class HlsEngineBuiltEvent extends HlsEvent {
  static TYPE = 'vds-hls-engine-built';
  constructor(eventInit) {
    super(HlsEngineBuiltEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 */
export class HlsEngineAttachEvent extends HlsEvent {
  static TYPE = 'vds-hls-engine-attach';
  constructor(eventInit) {
    super(HlsEngineAttachEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 */
export class HlsEngineDetachEvent extends HlsEvent {
  static TYPE = 'vds-hls-engine-detach';
  constructor(eventInit) {
    super(HlsEngineDetachEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 */
export class HlsEngineNoSupportEvent extends HlsEvent {
  static TYPE = 'vds-hls-engine-no-support';
  constructor(eventInit) {
    super(HlsEngineNoSupportEvent.TYPE, eventInit);
  }
}
