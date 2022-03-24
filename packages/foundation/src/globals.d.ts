/// <reference types="../dom" />

// -------------------------------------------------------------------------------------------
// Global Events
// -------------------------------------------------------------------------------------------

import type { ContextConsumerConnectEvent } from './context';
import type { FullscreenEvents } from './fullscreen';
import type { LoggerEvents } from './logger/events';
import type { ScreenOrientationEvents } from './screen-orientation';

declare global {
  interface GlobalEventHandlersEventMap
    extends FullscreenEvents,
      ScreenOrientationEvents,
      LoggerEvents {
    'vds-noop': any;
    'vds-context-consumer-connect': ContextConsumerConnectEvent;
  }
}
