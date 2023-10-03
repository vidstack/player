import type { Logger } from './controller';
import type { LogLevel } from './log-level';

export const GROUPED_LOG = Symbol(__DEV__ ? 'GROUPED_LOG' : 0);

export class GroupedLog {
  readonly [GROUPED_LOG] = true;
  readonly logs: ({ label?: string; data: any[] } | GroupedLog)[] = [];

  constructor(
    readonly logger: Logger,
    readonly level: LogLevel,
    readonly title: string,
    readonly root?: GroupedLog,
    readonly parent?: GroupedLog,
  ) {}

  log(...data: any[]): GroupedLog {
    this.logs.push({ data });
    return this;
  }

  labelledLog(label: string, ...data: any[]): GroupedLog {
    this.logs.push({ label, data });
    return this;
  }

  groupStart(title: string): GroupedLog {
    return new GroupedLog(this.logger, this.level, title, this.root ?? this, this);
  }

  groupEnd(): GroupedLog {
    this.parent?.logs.push(this);
    return this.parent ?? this;
  }

  dispatch(): boolean {
    return this.logger.dispatch(this.level, this.root ?? this);
  }
}

export function isGroupedLog(data: any): data is GroupedLog {
  return !!data?.[GROUPED_LOG];
}
