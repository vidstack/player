/// <reference types="../dom" />

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

export * from './context';
export * from './directives';
export * from './elements';
export * from './events';
export * from './fullscreen';
export * from './helper-types';
export * from './logger';
export * from './observers';
export * from './queue';
export * from './screen-orientation';
export * from './stores';
export * from './utils';
