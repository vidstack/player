import type Hls from 'hls.js';

import { VdsCustomEvent, VdsEventInit, VdsEvents } from '../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsHlsEvents {}
}

export interface HlsEvents {
  'hls-engine-built': VdsCustomEvent<Hls>;
  'hls-engine-attach': VdsCustomEvent<Hls>;
  'hls-engine-detach': VdsCustomEvent<Hls>;
  'hls-engine-no-support': VdsCustomEvent<void>;
}

export type VdsHlsEvents = VdsEvents<HlsEvents>;

export class VdsHlsEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof VdsHlsEvents;
}

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 */
export class VdsHlsEngineBuiltEvent extends VdsHlsEvent<Hls> {
  static readonly TYPE = 'vds-hls-engine-built';
  constructor(eventInit: VdsEventInit<Hls>) {
    super(VdsHlsEngineBuiltEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 */
export class VdsHlsEngineAttachEvent extends VdsHlsEvent<Hls> {
  static readonly TYPE = 'vds-hls-engine-attach';
  constructor(eventInit: VdsEventInit<Hls>) {
    super(VdsHlsEngineAttachEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 */
export class VdsHlsEngineDetachEvent extends VdsHlsEvent<Hls> {
  static readonly TYPE = 'vds-hls-engine-detach';
  constructor(eventInit: VdsEventInit<Hls>) {
    super(VdsHlsEngineDetachEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 */
export class VdsHlsEngineNoSupportEvent extends VdsHlsEvent<void> {
  static readonly TYPE = 'vds-hls-engine-no-support';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsHlsEngineNoSupportEvent.TYPE, eventInit);
  }
}
