import type Hls from 'hls.js';

import { LIB_PREFIX } from '../../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEventInit,
} from '../../shared/events';

export const HLS_EVENT_PREFIX = 'hls';

export type RawHlsEventType =
  | 'engine-built'
  | 'engine-attach'
  | 'engine-detach'
  | 'engine-no-support';

export type RawHlsEventDetailType = {
  'engine-built': Hls;
  'engine-attach': Hls;
  'engine-detach': Hls;
  'engine-no-support': void;
};

export type GenericVdsHlsEventType<
  T extends string
> = `${typeof LIB_PREFIX}-${typeof HLS_EVENT_PREFIX}-${T}`;

export type HlsEventConstructor<
  T extends RawHlsEventType
> = VdsCustomEventConstructor<RawHlsEventDetailType[T]>;

export type HlsEventConstructors = {
  [P in RawHlsEventType as GenericVdsHlsEventType<P>]: HlsEventConstructor<P>;
};

export type HlsEvents = {
  [P in RawHlsEventType as GenericVdsHlsEventType<P>]: VdsCustomEvent<
    RawHlsEventDetailType[P]
  >;
};

export type HlsEventType = keyof HlsEvents;

export function buildHlsEvent<
  P extends RawHlsEventType,
  DetailType = RawHlsEventDetailType[P]
>(type: P): VdsCustomEventConstructor<DetailType> {
  const prefixedType = `${HLS_EVENT_PREFIX}-${type}`;

  class HlsEvent extends buildVdsEvent<DetailType>(prefixedType) {
    constructor(eventInit?: VdsEventInit<DetailType>) {
      super({
        bubbles: false,
        ...(eventInit ?? {}),
      });
    }
  }

  return HlsEvent;
}

/**
 * Emitted when the `hls.js` instance is built. This will not fire if the browser natively
 * supports HLS.
 */
export class HlsEngineBuiltEvent extends buildHlsEvent('engine-built') {}

/**
 * Emitted when the `hls.js` instance has attached itself to the media element. This will not
 * fire if the browser natively supports HLS.
 */
export class HlsEngineAttachEvent extends buildHlsEvent('engine-attach') {}

/**
 * Emitted when the `hls.js` instance has detached itself from the media element.
 */
export class HlsEngineDetachEvent extends buildHlsEvent('engine-detach') {}

/**
 * Emitted when the browser doesn't support HLS natively and `hls.js` doesn't support
 * this enviroment either, most likely due to missing Media Extensions.
 */
export class HlsEngineNoSuppotEvent extends buildHlsEvent(
  'engine-no-support',
) {}
