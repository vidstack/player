import type Hls from 'hls.js';
import type { Events, HlsListeners } from 'hls.js';

import { VdsEvent } from '../../base/events';
import type { CamelToKebabCase } from '../../global/helpers';
import type { HlsElement } from './HlsElement';

export type HlsEvent<Detail> = VdsEvent<Detail> & {
  target: HlsElement;
};

export type HlsEvents = {
  'vds-hls-lib-load-start': HlsLibLoadStartEvent;
  'vds-hls-lib-loaded': HlsLibLoadedEvent;
  'vds-hls-lib-load-error': HlsLibLoadErrorEvent;
  'vds-hls-instance': HlsInstanceEvent;
  'vds-hls-unsupported': HlsUnsupportedEvent;
} & {
  [EventType in Events as `vds-${CamelToKebabCase<EventType>}`]: HlsEvent<
    Parameters<HlsListeners[EventType]>[1]
  >;
};

/**
 * Fired when the browser begins downloading the `hls.js` library.
 *
 * @event
 */
export type HlsLibLoadStartEvent = HlsEvent<void>;

/**
 * Fired when the `hls.js` library has been loaded.
 *
 * @event
 */
export type HlsLibLoadedEvent = HlsEvent<typeof Hls>;

/**
 * Fired when the `hls.js` library fails during the download process.
 *
 * @event
 */
export type HlsLibLoadErrorEvent = HlsEvent<Error>;

/**
 * Fired when the `hls.js` instance is built. This will not fire if the browser does not
 * support `hls.js`.
 *
 * @event
 */
export type HlsInstanceEvent = HlsEvent<Hls>;

/**
 * Fired when the browser doesn't support HLS natively, _and_ `hls.js` doesn't support
 * this environment either, most likely due to missing Media Extensions or video codecs.
 *
 * @event
 */
export type HlsUnsupportedEvent = HlsEvent<void>;
