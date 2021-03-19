import type Hls from 'hls.js';

import { LIB_PREFIX } from '../../shared/constants';
import {
  buildVdsEvent,
  ExtractEventDetailType,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEventInit,
} from '../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsHlsEvents {}
}

export interface HlsEvents {
  'hls-engine-built': VdsCustomEvent<Hls>;
  'hls-engine-attach': VdsCustomEvent<Hls>;
  'hls-engine-detach': VdsCustomEvent<Hls>;
  'hls-engine-no-support': void;
}

export type VdsHlsEvents = {
  [P in keyof HlsEvents as `${typeof LIB_PREFIX}-${P}`]: HlsEvents[P];
};

export function buildVdsHlsEvent<
  P extends keyof HlsEvents,
  DetailType = ExtractEventDetailType<HlsEvents[P]>
>(type: P): VdsCustomEventConstructor<DetailType> {
  return class VdsHlsEvent extends buildVdsEvent<DetailType>(type) {
    constructor(eventInit?: VdsEventInit<DetailType>) {
      super({
        bubbles: false,
        ...(eventInit ?? {}),
      });
    }
  };
}

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 */
export class VdsHlsEngineBuiltEvent extends buildVdsHlsEvent(
  'hls-engine-built',
) {}

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 */
export class VdsHlsEngineAttachEvent extends buildVdsHlsEvent(
  'hls-engine-attach',
) {}

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 */
export class VdsHlsEngineDetachEvent extends buildVdsHlsEvent(
  'hls-engine-detach',
) {}

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 */
export class VdsHlsEngineNoSuppotEvent extends buildVdsHlsEvent(
  'hls-engine-no-support',
) {}
