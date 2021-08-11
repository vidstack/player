/* c8 ignore next 1000 */

import { ReactiveController, ReactiveControllerHost } from 'lit';

import { IS_CLIENT } from '../../utils/support';
import { isUndefined } from '../../utils/unit';
import { ContextConsumerController, createContext } from '../context';
import { ms } from './ms';

export enum LogLevel {
  Silent = 0,
  Error = 1,
  Warn = 2,
  Info = 3,
  Debug = 4
}

export const LogLevelNameMap = Object.freeze({
  [LogLevel.Silent]: 'silent',
  [LogLevel.Error]: 'error',
  [LogLevel.Warn]: 'warn',
  [LogLevel.Info]: 'info',
  [LogLevel.Debug]: 'debug'
});

export const LogLevelColor = Object.freeze({
  [LogLevel.Silent]: 'white',
  [LogLevel.Error]: 'hsl(6, 58%, 50%)',
  [LogLevel.Warn]: 'hsl(51, 58%, 50%)',
  [LogLevel.Info]: 'hsl(219, 58%, 50%)',
  [LogLevel.Debug]: 'hsl(280, 58%, 50%)'
});

export type LogLevelName = 'silent' | 'error' | 'warn' | 'info' | 'debug';

export interface LoggerOptions {
  /**
   * A unique color used to help identify the current logger in the logs. By default this is a
   * random generated HSL color.
   */
  color?: string;
  /**
   * A string used to help identify the logged messages by this logger.
   */
  name?: string | symbol;
  /**
   * Current class that owns the logger.
   */
  owner?: any;
  /**
   * Custom log level.
   */
  logLevel?: LogLevel;
}

export interface GroupLogStream {
  append(...data: any[]): GroupLogStream;
  appendWithLabel(label: string, ...data: any[]): GroupLogStream;
  group(snippetMessage: string): GroupLogStream;
  end(): GroupLogStream;
}

export const logLevel = createContext(LogLevel.Silent);

const HOST_COLORS_LOCAL_STORAGE_KEY = 'vds-debug-host-colors';

const colors = getSavedColors();

function getSavedColors(): Map<string, string> {
  if (IS_CLIENT && !isUndefined(window.localStorage)) {
    let colors = {};

    try {
      colors = JSON.parse(
        localStorage.getItem(HOST_COLORS_LOCAL_STORAGE_KEY) ?? ''
      );
    } catch {
      // no-op
    }

    return new Map(Object.entries(colors));
  }

  return new Map();
}

function saveColors() {
  if (IS_CLIENT && !isUndefined(window.localStorage)) {
    const map = {};

    colors.forEach(function (value, key) {
      map[key] = value;
    });

    localStorage.setItem(HOST_COLORS_LOCAL_STORAGE_KEY, JSON.stringify(map));
  }
}

export class Logger implements ReactiveController {
  protected readonly _logLevelCtx: ContextConsumerController<LogLevel>;

  get name() {
    const owner = this._options.owner ?? this._host;
    return owner.constructor?.name ?? owner.name ?? 'unknown';
  }

  get level() {
    return isUndefined(this._options.logLevel)
      ? this._logLevelCtx.value
      : this._options.logLevel;
  }

  set level(newLevel: LogLevel) {
    this._options.logLevel = newLevel;
  }

  constructor(
    protected readonly _host: ReactiveControllerHost,
    protected readonly _options: LoggerOptions = {}
  ) {
    this._options.color = _options.color;

    if (!_options.color) {
      const color =
        colors.get(this.name) ?? `hsl(${Math.random() * 360}, 55%, 70%)`;
      this._options.color = color;
      colors.set(this.name, color);
      saveColors();
    }

    this._logLevelCtx = logLevel.consume(_host);

    _host.addController(this);
  }

  hostConnected() {
    // no-op
  }

  error(...data: any[]): void {
    this._log(LogLevel.Error, ...data);
  }

  warn(...data: any[]): void {
    this._log(LogLevel.Warn, ...data);
  }

  log(...data: any[]): void {
    this._log(LogLevel.Info, ...data);
  }

  info(...data: any[]): void {
    this._log(LogLevel.Info, ...data);
  }

  debug(...data: any[]): void {
    this._log(LogLevel.Debug, ...data);
  }

  errorGroup(snippetMessage: string, ...data: any[]) {
    return this._startGroup(LogLevel.Error, `🔥️ ${snippetMessage}`);
  }

  warnGroup(snippetMessage: string, ...data: any[]) {
    return this._startGroup(LogLevel.Warn, `🚨 ${snippetMessage}`);
  }

  logGroup(snippetMessage: string, ...data: any[]) {
    return this._startGroup(LogLevel.Info, snippetMessage);
  }

  infoGroup(snippetMessage: string, ...data: any[]) {
    return this._startGroup(LogLevel.Info, snippetMessage);
  }

  debugGroup(snippetMessage: string, ...data: any[]) {
    return this._startGroup(LogLevel.Debug, snippetMessage);
  }

  protected _hasStartedGroup = false;

  protected _startGroup(
    level: LogLevel,
    snippetMessage?: string,
    parentStream?: GroupLogStream
  ): GroupLogStream {
    if (this.level < level) {
      const blankStream = {
        append: () => blankStream,
        appendWithLabel: () => blankStream,
        group: () => blankStream,
        end: () => blankStream
      };

      return blankStream;
    }

    this._startCollapsedGroup(level, snippetMessage);
    this._hasStartedGroup = true;

    let groupEnded = false;

    const stream = {
      append: (...data: any[]) => {
        if (groupEnded) return stream;
        console.log(...data);
        return stream;
      },
      appendWithLabel: (label: string, ...data: any[]) => {
        if (groupEnded) return stream;
        this._labelledLog(label, ...data);
        return stream;
      },
      group: (snippetMessage: string) => {
        if (groupEnded) return stream;
        console.groupCollapsed(snippetMessage);
        return this._startGroup(level, snippetMessage, stream);
      },
      end: () => {
        if (groupEnded) return parentStream ?? stream;

        if (!parentStream) {
          this._endGroup();
        } else {
          console.groupEnd();
        }

        groupEnded = true;
        return parentStream ?? stream;
      }
    };

    return stream;
  }

  protected _endGroup() {
    this._hasStartedGroup = false;
    this._logTrace();
    console.groupEnd();
  }

  protected _lastDebugTimestamp?: number;

  protected _getDebugTimeDiff() {
    const diff =
      performance.now() - (this._lastDebugTimestamp ??= performance.now());
    this._lastDebugTimestamp = performance.now();
    return ms(diff);
  }

  protected _getGroupName() {
    const hostName = this._host.constructor?.name ?? 'unknown';
    return this.name !== hostName
      ? `${hostName}::${this.name} `
      : `${hostName} `;
  }

  protected _startCollapsedGroup(level: LogLevel, snippetMessage?: string) {
    if (this._hasStartedGroup) return;

    const hostName = this._host.constructor?.name ?? 'unknown';
    const groupName = this._getGroupName();
    const namespace = this._options.name ? `${String(this._options.name)}` : '';
    const logLevelName = LogLevelNameMap[level];

    const truncatedSnippetMessage = snippetMessage
      ? `${namespace.length > 0 ? ' ' : ''}${snippetMessage.substring(
          0,
          Math.min(snippetMessage.length, 100)
        )}`
      : '';

    console.groupCollapsed(
      `%c${logLevelName}%c ${groupName}%c${namespace}%c${truncatedSnippetMessage}`,
      `background: ${LogLevelColor[level]}; color: white; padding: 1.2px 2.2px; border-radius: 2px; font-size: 10px;`,
      `color: ${this._options.color}; padding: 4px 0px;`,
      namespace.length > 0 ? 'color: hsl(0, 0%, 50%);' : '',
      'color: hsl(0, 0%, 68%); font-size: 11px;'
    );

    console.groupCollapsed(`%cHost element: %c${hostName}`, 'color: gray', '');
    console.log(this._host);
    console.groupEnd();

    this._labelledLog('Log level', LogLevelNameMap[level]);

    if (this._options.owner && this._options.owner !== this._host) {
      console.groupCollapsed(
        `%cOwner class: %c${this.name}`,
        'color: gray',
        ''
      );
      console.log(this._options.owner);
      console.groupEnd();
    }

    this._labelledLog('Time since last log', this._getDebugTimeDiff());
  }

  protected _log(level: LogLevel, ...data: any[]) {
    if (this.level < level) return;

    this._startCollapsedGroup(level, data.map(String).join(' '));
    this._labelledLog('Message', ...data);

    if (!this._hasStartedGroup) {
      this._logTrace();
      console.groupEnd();
    }
  }

  protected _labelledLog(label: string, ...data: any[]) {
    console.log(`%c${label}:`, 'color: gray', ...data);
  }

  protected _logTrace() {
    console.groupCollapsed('%cStack Trace', 'color: gray');
    console.trace();
    console.groupEnd();
  }
}

export class ElementLogger extends Logger {
  override hostConnected() {
    super.hostConnected();
    this.debug('🧬 connected');
  }

  hostUpdated() {
    this.debug('🧬 updated');
  }

  hostDisconnected() {
    this.debug('🧬 disconnected');
  }
}
