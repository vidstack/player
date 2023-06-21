import { onDispose, ViewController } from 'maverick.js';
import { DOMEvent } from 'maverick.js/std';

import type { LogEventDetail } from './events';
import { GroupedLog } from './grouped-log';
import type { LogLevel } from './log-level';

export class LoggerController extends ViewController {
  private _logger = new Logger();

  protected override onConnect(el: HTMLElement) {
    this._logger.setTarget(el);
    onDispose(this._onDisconnect.bind(this));
  }

  protected _onDisconnect() {
    this._logger.setTarget(null);
  }
}

export class Logger {
  private _target: EventTarget | null = null;

  error(...data: any[]): boolean {
    return this.dispatch('error', ...data);
  }

  warn(...data: any[]): boolean {
    return this.dispatch('warn', ...data);
  }

  info(...data: any[]): boolean {
    return this.dispatch('info', ...data);
  }

  debug(...data: any[]): boolean {
    return this.dispatch('debug', ...data);
  }

  errorGroup(title: string): GroupedLog {
    return new GroupedLog(this, 'error', title);
  }

  warnGroup(title: string): GroupedLog {
    return new GroupedLog(this, 'warn', title);
  }

  infoGroup(title: string): GroupedLog {
    return new GroupedLog(this, 'info', title);
  }

  debugGroup(title: string): GroupedLog {
    return new GroupedLog(this, 'debug', title);
  }

  setTarget(newTarget: EventTarget | null): void {
    this._target = newTarget;
  }

  dispatch(level: LogLevel, ...data: any[]): boolean {
    return (
      this._target?.dispatchEvent(
        new DOMEvent<LogEventDetail>('vds-log', {
          bubbles: true,
          composed: true,
          detail: { level, data },
        }),
      ) || false
    );
  }
}
