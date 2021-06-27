import type Hls from 'hls.js';

import { VdsCustomEvent, VdsEventInit } from '../../shared/events/index.js';

declare global {
  interface GlobalEventHandlersEventMap extends HlsEvents {}
}

export interface HlsEvents {
  'vds-hls-engine-built': VdsCustomEvent<Hls>;
  'vds-hls-engine-detach': VdsCustomEvent<Hls>;
  'vds-hls-engine-attach': VdsCustomEvent<Hls>;
  'vds-hls-engine-no-support': VdsCustomEvent<void>;
}

export class HlsEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof HlsEvents;
}

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 */
export class HlsEngineBuiltEvent extends HlsEvent<Hls> {
  static readonly TYPE = 'vds-hls-engine-built';
  constructor(eventInit: VdsEventInit<Hls>) {
    super(HlsEngineBuiltEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 */
export class HlsEngineAttachEvent extends HlsEvent<Hls> {
  static readonly TYPE = 'vds-hls-engine-attach';
  constructor(eventInit: VdsEventInit<Hls>) {
    super(HlsEngineAttachEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 */
export class HlsEngineDetachEvent extends HlsEvent<Hls> {
  static readonly TYPE = 'vds-hls-engine-detach';
  constructor(eventInit: VdsEventInit<Hls>) {
    super(HlsEngineDetachEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 */
export class HlsEngineNoSupportEvent extends HlsEvent<void> {
  static readonly TYPE = 'vds-hls-engine-no-support';
  constructor(eventInit?: VdsEventInit<void>) {
    super(HlsEngineNoSupportEvent.TYPE, eventInit);
  }
}
