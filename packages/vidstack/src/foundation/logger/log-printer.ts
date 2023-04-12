import { effect, type ReadSignal } from 'maverick.js';
import { isString, isUndefined, listenEvent } from 'maverick.js/std';

import { getLogColor, saveLogColor } from './colors';
import { isGroupedLog, type GroupedLog } from './create-grouped-log';
import { LogLevelColor, LogLevelValue, type LogLevel } from './log-level';
import { ms } from './ms';

export function createLogPrinter($target: ReadSignal<EventTarget | null>): LogPrinter {
  // No log printing in production.
  if (!__DEV__) {
    return {
      get logLevel(): LogLevel {
        return 'silent';
      },
      set logLevel(_: LogLevel) {
        // no-op
      },
    };
  }

  let logLevel: LogLevel = 'warn',
    lastLogTimestamp: number | undefined = undefined;

  effect(() => {
    const target = $target();
    if (!target) return;

    listenEvent(target, 'vds-log', (event) => {
      event.stopPropagation();

      const eventTargetName = (
        (event as { path?: Element[] }).path?.[0] ?? (event.target as Element)
      ).tagName.toLowerCase();

      const { level = 'warn', data } = event.detail ?? {};

      if (LogLevelValue[logLevel] < LogLevelValue[level]) {
        return;
      }

      saveLogColor(eventTargetName);

      const hint =
        data?.length === 1 && isGroupedLog(data[0])
          ? data[0].title
          : isString(data?.[0])
          ? data![0]
          : '';

      console.groupCollapsed(
        `%c${level.toUpperCase()}%c ${eventTargetName}%c ${hint.slice(0, 50)}${
          hint.length > 50 ? '...' : ''
        }`,
        `background: ${LogLevelColor[level]}; color: white; padding: 1.5px 2.2px; border-radius: 2px; font-size: 11px;`,
        `color: ${getLogColor(eventTargetName)}; padding: 4px 0px; font-size: 11px;`,
        'color: gray; font-size: 11px; padding-left: 4px;',
      );

      if (data?.length === 1 && isGroupedLog(data[0])) {
        printGroup(level, data![0]);
      } else if (data) {
        print(level, ...data);
      }

      printTimeDiff();
      printStackTrace();

      console.groupEnd();
    });

    return () => {
      lastLogTimestamp = undefined;
    };
  });

  const calcLastLogTimeDiff = () => {
    const time = performance.now();
    const diff = time - (lastLogTimestamp ?? (lastLogTimestamp = performance.now()));
    lastLogTimestamp = time;
    return ms(diff);
  };

  const printTimeDiff = () => {
    labelledPrint('Time since last log', calcLastLogTimeDiff());
  };

  return {
    get logLevel() {
      return logLevel;
    },
    set logLevel(level) {
      logLevel = level;
    },
  };
}

export interface LogPrinter {
  /**
   * The current log level.
   */
  logLevel: LogLevel;
}

function print(level: LogLevel, ...data: any[]) {
  console[level as 'info'](...data);
}

function labelledPrint(label: string, ...data: any[]) {
  console.log(`%c${label}:`, 'color: gray', ...data);
}

function printStackTrace() {
  console.groupCollapsed('%cStack Trace', 'color: gray');
  console.trace();
  console.groupEnd();
}

function printGroup(level: LogLevel, groupedLog: GroupedLog) {
  console.groupCollapsed(groupedLog.title);

  for (const log of groupedLog.logs) {
    if (isGroupedLog(log)) {
      printGroup(level, log);
    } else if ('label' in log && !isUndefined(log.label)) {
      labelledPrint(log.label, ...log.data);
    } else {
      print(level, ...log.data);
    }
  }

  console.groupEnd();
}
