import { VdsEvent, vdsEvent } from '../events';
import { type LogLevel } from './LogLevel';

export type LoggerEvents = {
  'vds-log': LogEvent;
};

/**
 * @event
 * @bubbles
 * @composed
 */
export type LogEvent = VdsEvent<{
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
}>;

export function logEvent(level: LogLevel, ...data: any[]) {
  return vdsEvent('vds-log', {
    bubbles: true,
    composed: true,
    detail: {
      level,
      data,
    },
  });
}
