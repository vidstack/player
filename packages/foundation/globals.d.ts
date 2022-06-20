/// <reference path="./dom.d.ts" />

import type {
  ContextConsumerConnectEvent,
  FullscreenEvents,
  LoggerEvents,
  ScreenOrientationEvents,
} from './index';

declare global {
  interface VdsElementEventMap extends FullscreenEvents, ScreenOrientationEvents, LoggerEvents {
    'vds-noop': any;
    'vds-context-consumer-connect': ContextConsumerConnectEvent;
  }
}

export {};
