import { createGroupedLog, GROUPED_LOG, type GroupedLog } from './create-grouped-log';
import { dispatchLogEvent } from './dispatch';
import type { LogLevel } from './log-level';

export interface Logger {
  error(...data: any[]): boolean;
  warn(...data: any[]): boolean;
  info(...data: any[]): boolean;
  debug(...data: any[]): boolean;
  errorGroup(title: string): GroupedLogger;
  warnGroup(title: string): GroupedLogger;
  infoGroup(title: string): GroupedLogger;
  debugGroup(title: string): GroupedLogger;
  setTarget(newTarget: EventTarget | null): void;
}

export interface GroupedLogger {
  readonly [GROUPED_LOG]?: true;
  readonly title: string;
  readonly logs: ({ label?: string; data: any[] } | GroupedLog)[];
  log(...data: any[]): GroupedLogger;
  labelledLog(label: string, ...data: any[]): GroupedLogger;
  groupStart(title: string): GroupedLogger;
  groupEnd(): GroupedLogger;
  dispatch(): boolean;
}

/**
 * Create a simple facade that simplifies dispatching log events from a given `host` target.
 */
export function createLogger(): Logger {
  let target: EventTarget | null = null;

  const createGroupedLogger = (
    level: LogLevel,
    title: string,
    rootGroup?: GroupedLog,
    parentGroup?: GroupedLog,
  ) => {
    const group = createGroupedLog(title, parentGroup);
    (group as GroupedLogger).dispatch = () => dispatchLogEvent(target, level, rootGroup ?? group);
    return {
      ...group,
      groupStart: (title) => createGroupedLogger(level, title, rootGroup ?? group, group),
    } as GroupedLogger;
  };

  return {
    error: (...data) => dispatchLogEvent(target, 'error', ...data),
    warn: (...data) => dispatchLogEvent(target, 'warn', ...data),
    info: (...data) => dispatchLogEvent(target, 'info', ...data),
    debug: (...data) => dispatchLogEvent(target, 'debug', ...data),
    errorGroup: (title) => createGroupedLogger('error', title),
    warnGroup: (title) => createGroupedLogger('warn', title),
    infoGroup: (title) => createGroupedLogger('info', title),
    debugGroup: (title) => createGroupedLogger('debug', title),
    setTarget: (newTarget) => {
      target = newTarget;
    },
  };
}
