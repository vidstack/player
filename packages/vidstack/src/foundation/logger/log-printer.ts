import { onDispose, ViewController } from 'maverick.js';
import type { MaverickElement } from 'maverick.js/element';
import { isString, isUndefined } from 'maverick.js/std';

import { getLogColor, saveLogColor } from './colors';
import { isGroupedLog, type GroupedLog } from './grouped-log';
import { LogLevelColor, LogLevelValue, type LogLevel } from './log-level';
import { ms } from './ms';

export class LogPrinter extends ViewController {
  private _level: LogLevel = __DEV__ ? 'warn' : 'silent';
  private _lastLogged: number | undefined;

  /**
   * The current log level.
   */
  get logLevel(): LogLevel {
    return __DEV__ ? this._level : 'silent';
  }

  set logLevel(level) {
    if (__DEV__) this._level = level;
  }

  protected override onConnect() {
    this.listen('vds-log', (event) => {
      event.stopPropagation();

      const element =
          (event as { path?: Element[] }).path?.[0] ??
          (event.target instanceof ViewController ? event.target.el : (event.target as Element)),
        eventTargetName =
          (element as MaverickElement as any)?.$$COMPONENT_NAME
            ?.replace(/^_/, '')
            .replace(/Instance$/, '') ??
          element?.tagName.toLowerCase() ??
          'unknown';

      const { level = 'warn', data } = event.detail ?? {};

      if (LogLevelValue[this._level] < LogLevelValue[level]) {
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
        if (element) data[0].logs.unshift({ label: 'Element', data: [element] });
        printGroup(level, data![0]);
      } else if (data) {
        print(level, ...data);
      }

      this._printTimeDiff();
      printStackTrace();

      console.groupEnd();
    });

    onDispose(() => {
      this._lastLogged = undefined;
    });
  }

  private _printTimeDiff() {
    labelledPrint('Time since last log', this._calcLastLogTimeDiff());
  }

  private _calcLastLogTimeDiff() {
    const time = performance.now();
    const diff = time - (this._lastLogged ?? (this._lastLogged = performance.now()));
    this._lastLogged = time;
    return ms(diff);
  }
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
  for (const log of groupedLog.logs) {
    if (isGroupedLog(log)) {
      console.groupCollapsed(groupedLog.title);
      printGroup(level, log);
      console.groupEnd();
    } else if ('label' in log && !isUndefined(log.label)) {
      labelledPrint(log.label, ...log.data);
    } else {
      print(level, ...log.data);
    }
  }
}
