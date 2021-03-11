import { LIB_PREFIX } from '../../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
} from '../../shared/events';

export const BUFFERING_INDICATOR_EVENT_PREFIX = 'buffering-indicator';

export type RawBufferingIndicatorEventType = 'show' | 'hide';

export type RawBufferingIndicatorEventDetailType = {
  show: void;
  hide: void;
};

export type GenericBufferingIndicatorEventType<
  T extends string
> = `${typeof LIB_PREFIX}-${typeof BUFFERING_INDICATOR_EVENT_PREFIX}-${T}`;

export type BufferingIndicatorEvents = {
  [P in RawBufferingIndicatorEventType as GenericBufferingIndicatorEventType<P>]: VdsCustomEvent<
    RawBufferingIndicatorEventDetailType[P]
  >;
};

export type BufferingIndicatorEventType = keyof BufferingIndicatorEvents;

export function buildBufferingIndicatorEvent<
  P extends RawBufferingIndicatorEventType,
  DetailType = RawBufferingIndicatorEventDetailType[P]
>(type: P): VdsCustomEventConstructor<DetailType> {
  const prefixedType = `${BUFFERING_INDICATOR_EVENT_PREFIX}-${type}`;
  class BufferingIndicatorEvent extends buildVdsEvent<DetailType>(
    prefixedType,
  ) {}
  return BufferingIndicatorEvent;
}

/**
 * Emitted when the buffering indicator is shown.
 */
export class BufferingIndicatorShowEvent extends buildBufferingIndicatorEvent(
  'show',
) {}

/**
 * Emitted when the buffering indicator is hidden.
 */
export class BufferingIndicatorHideEvent extends buildBufferingIndicatorEvent(
  'hide',
) {}
