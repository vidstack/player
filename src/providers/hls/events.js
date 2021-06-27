import { VdsCustomEvent } from '../../shared/events/index.js';

export class VdsHlsEvent extends VdsCustomEvent {}

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 */
export class VdsHlsEngineBuiltEvent extends VdsHlsEvent {
  static TYPE = 'vds-hls-engine-built';
  constructor(eventInit) {
    super(VdsHlsEngineBuiltEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 */
export class VdsHlsEngineAttachEvent extends VdsHlsEvent {
  static TYPE = 'vds-hls-engine-attach';
  constructor(eventInit) {
    super(VdsHlsEngineAttachEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 */
export class VdsHlsEngineDetachEvent extends VdsHlsEvent {
  static TYPE = 'vds-hls-engine-detach';
  constructor(eventInit) {
    super(VdsHlsEngineDetachEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 */
export class VdsHlsEngineNoSupportEvent extends VdsHlsEvent {
  static TYPE = 'vds-hls-engine-no-support';
  constructor(eventInit) {
    super(VdsHlsEngineNoSupportEvent.TYPE, eventInit);
  }
}
