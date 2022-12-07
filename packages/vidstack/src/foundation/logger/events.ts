import type { DOMEvent } from 'maverick.js/std';

import type { LogLevel } from './log-level';

declare global {
  interface MaverickOnAttributes extends LoggerEvents {}
}

export interface LoggerEvents {
  'vds-log': LogEvent;
}

/**
 * @event
 * @bubbles
 * @composed
 */
export interface LogEvent
  extends DOMEvent<{
    /**
     * The log level.
     *
     * @defaultValue 'info'
     */
    level?: LogLevel;
    /**
     * Data to be logged.
     *
     * @defaultValue undefined
     */
    data?: any[];
  }> {}
