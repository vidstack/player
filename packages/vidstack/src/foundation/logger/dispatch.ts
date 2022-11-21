import { dispatchEvent } from 'maverick.js/std';

import type { LogLevel } from './log-level';

export function dispatchLogEvent(target: EventTarget | null, level: LogLevel, ...data: any[]) {
  return dispatchEvent(target, 'vds-log', {
    bubbles: true,
    composed: true,
    detail: { level, data },
  });
}
