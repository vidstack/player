import type { DOMEvent } from 'maverick.js/std';

import type { LogLevel } from './log-level';

declare global {
  interface MaverickOnAttributes extends LoggerEvents {}
}

export interface LoggerEvents {
  'vds-log': LogEvent;
}

export interface LogEventDetail {
  /**
   * The log level.
   */
  level: LogLevel;
  /**
   * Data to be logged.
   */
  data?: any[];
}

/**
 * @bubbles
 * @composed
 */
export interface LogEvent extends DOMEvent<LogEventDetail> {}
