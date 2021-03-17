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
  hlsenginebuilt: VdsCustomEvent<Hls>;
  hlsengineattach: VdsCustomEvent<Hls>;
  hlsenginedetach: VdsCustomEvent<Hls>;
  hlsenginenosupport: void;
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
  'hlsenginebuilt',
) {}

/**
 * Fired when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 */
export class VdsHlsEngineAttachEvent extends buildVdsHlsEvent(
  'hlsengineattach',
) {}

/**
 * Fired when the `hls.js` instance has detached itself from the media element.
 */
export class VdsHlsEngineDetachEvent extends buildVdsHlsEvent(
  'hlsenginedetach',
) {}

/**
 * Fired when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 */
export class VdsHlsEngineNoSuppotEvent extends buildVdsHlsEvent(
  'hlsenginenosupport',
) {}
