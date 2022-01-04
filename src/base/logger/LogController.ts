import type { ReactiveControllerHost } from 'lit';

import { isUndefined } from '../../utils/unit';
import { DisposalBin, listen } from '../events';
import { getColor, saveColor } from './colors';
import { GroupedLog, isGroupedLog } from './groupedLog';
import { LogLevel, LogLevelColor, LogLevelValue } from './LogLevel';
import { ms } from './ms';

export class LogController {
  logLevel: LogLevel = __DEV__ ? 'warn' : 'silent';

  protected _disposal = new DisposalBin();

  constructor(protected readonly _host: ReactiveControllerHost & EventTarget) {
    _host.addController({
      hostConnected: this._start.bind(this),
      hostDisconnected: this._stop.bind(this)
    });
  }

  protected _start() {
    this._disposal.add(
      listen(this._host, 'vds-log', (event) => {
        const eventTargetName = (event.target as Element).tagName.toLowerCase();

        const { level = 'warn', data } = event.detail;

        if (LogLevelValue[this.logLevel] < LogLevelValue[level]) {
          return;
        }

        saveColor(eventTargetName);

        console.groupCollapsed(
          `%c[${level.toUpperCase()}]: %c${eventTargetName}`,
          `background: ${LogLevelColor[level]}; color: white; padding: 1.2px 2.2px; border-radius: 2px; font-size: 10px;`,
          `color: ${getColor(eventTargetName)}; padding: 4px 0px;`
        );

        if (data?.length === 1 && isGroupedLog(data[0])) {
          this._logGroup(level, data![0]);
        } else {
          this._log(level, data);
        }

        this._logTimeDiff();
        this._logStackTrace();

        console.groupEnd();
      })
    );
  }

  protected _stop() {
    this._lastLogTimestamp = undefined;
    this._disposal.empty();
  }

  protected _logGroup(level: LogLevel, groupedLog: GroupedLog) {
    console.groupCollapsed(groupedLog.title);

    for (const log of groupedLog.logs) {
      if (isGroupedLog(log)) {
        this._logGroup(level, log);
      } else if ('label' in log && !isUndefined(log.label)) {
        this._labelledLog(log.label, ...log.data);
      } else {
        this._log(level, ...log.data);
      }
    }

    console.groupEnd();
  }

  protected _log(level: LogLevel, ...data: any[]) {
    console[level as 'info'](...data);
  }

  protected _labelledLog(label: string, ...data: any[]) {
    console.log(`%c${label}:`, 'color: gray', ...data);
  }

  protected _logStackTrace() {
    console.groupCollapsed('%cStack Trace', 'color: gray');
    console.trace();
    console.groupEnd();
  }

  protected _logTimeDiff() {
    this._labelledLog('Time since last log', this._getLastLogTimeDiff());
  }

  protected _lastLogTimestamp?: number;
  protected _getLastLogTimeDiff() {
    const time = performance.now();
    const diff = time - (this._lastLogTimestamp ??= performance.now());
    this._lastLogTimestamp = time;
    return ms(diff);
  }
}
