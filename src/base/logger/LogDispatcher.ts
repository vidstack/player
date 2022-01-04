import type { ReactiveControllerHost } from 'lit';

import { logEvent } from './events';
import { type GROUPED_LOG_ID, type GroupedLog, groupedLog } from './groupedLog';
import type { LogLevel } from './LogLevel';

/**
 * Simple facade that simplifies dispatching log events from a given `host` element.
 */
export class LogDispatcher {
  constructor(protected readonly _host: ReactiveControllerHost & EventTarget) {}

  error(...data: any[]) {
    this._dispatch('error', ...data);
  }

  warn(...data: any[]) {
    this._dispatch('warn', ...data);
  }

  info(...data: any[]) {
    this._dispatch('info', ...data);
  }

  debug(...data: any[]) {
    this._dispatch('debug', ...data);
  }

  errorGroup(title: string): GroupedLogDispatch {
    return this._groupDispatcher('error', title);
  }

  warnGroup(title: string): GroupedLogDispatch {
    return this._groupDispatcher('warn', title);
  }

  infoGroup(title: string): GroupedLogDispatch {
    return this._groupDispatcher('info', title);
  }

  debugGroup(title: string): GroupedLogDispatch {
    return this._groupDispatcher('debug', title);
  }

  protected _dispatch(level: LogLevel, ...data: any[]) {
    if (__DEV__) {
      this._host.dispatchEvent(logEvent(level, ...data));
    }
  }

  protected _groupDispatcher(
    level: LogLevel,
    title: string,
    rootGroup?: GroupedLog,
    parentGroup?: GroupedLog
  ): GroupedLogDispatch {
    const group = groupedLog(title, parentGroup);

    (group as GroupedLogDispatch).dispatch = () => {
      this._dispatch(level, rootGroup ?? group);
    };

    return {
      ...group,
      groupStart: (title) => {
        return this._groupDispatcher(level, title, rootGroup ?? group, group);
      }
    } as GroupedLogDispatch;
  }
}

export type GroupedLogDispatch = {
  readonly [GROUPED_LOG_ID]: true;
  readonly title: string;
  readonly logs: ({ label?: string; data: any[] } | GroupedLog)[];
  log(...data: any[]): GroupedLogDispatch;
  labelledLog(label: string, ...data: any[]): GroupedLogDispatch;
  groupStart(title: string): GroupedLogDispatch;
  groupEnd(): GroupedLogDispatch;
  append(...groupedLogs: GroupedLog[]): GroupedLogDispatch;
  dispatch(): void;
};
