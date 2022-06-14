/// <reference types="./dom" />

import type {
  ContextConsumerConnectEvent,
  FullscreenEvents,
  LoggerEvents,
  ScreenOrientationEvents,
} from './index';

declare global {
  interface GlobalEventHandlersEventMap
    extends FullscreenEvents,
      ScreenOrientationEvents,
      LoggerEvents {
    'vds-noop': any;
    'vds-context-consumer-connect': ContextConsumerConnectEvent;
  }
}
