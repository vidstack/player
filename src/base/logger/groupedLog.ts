import { isObject } from '../../utils/unit';

export const GROUPED_LOG_ID = Symbol('@vidstack/grouped-log');

export type GroupedLog = {
  readonly [GROUPED_LOG_ID]: true;
  readonly title: string;
  readonly logs: ({ label?: string; data: any[] } | GroupedLog)[];
  log(...data: any[]): GroupedLog;
  labelledLog(label: string, ...data: any[]): GroupedLog;
  groupStart(title: string): GroupedLog;
  groupEnd(): GroupedLog;
  append(...groupedLogs: GroupedLog[]): GroupedLog;
};

export function isGroupedLog(data: unknown): data is GroupedLog {
  return isObject(data) && data[GROUPED_LOG_ID];
}

export function groupedLog(title: string, parent?: GroupedLog): GroupedLog {
  const logs: GroupedLog['logs'] = [];

  const group: GroupedLog = {
    [GROUPED_LOG_ID]: true,
    title,
    logs,
    log(...data) {
      logs.push({ data });
      return group;
    },
    labelledLog(label, ...data) {
      logs.push({ label, data });
      return group;
    },
    groupStart(title) {
      return groupedLog(title, group);
    },
    groupEnd() {
      return parent ?? group;
    },
    append(...groupedLogs) {
      logs.concat(groupedLogs);
      return group;
    }
  };

  return group;
}
