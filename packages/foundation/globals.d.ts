/// <reference types="./dom" />

// -------------------------------------------------------------------------------------------
// Global Events
// -------------------------------------------------------------------------------------------

import type { ContextConsumerConnectEvent } from './types/context';
import type { FullscreenEvents } from './types/fullscreen';
import type { LoggerEvents } from './types/logger/events';
import type { ScreenOrientationEvents } from './types/screen-orientation';

declare global {
  interface GlobalEventHandlersEventMap
    extends FullscreenEvents,
      ScreenOrientationEvents,
      LoggerEvents {
    'vds-noop': any;
    'vds-context-consumer-connect': ContextConsumerConnectEvent;
  }
}
