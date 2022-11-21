import { isObject } from 'maverick.js/std';

export const GROUPED_LOG = Symbol('GROUPED_LOG');

export type GroupedLog = {
  readonly [GROUPED_LOG]?: true;
  readonly title: string;
  readonly logs: ({ label?: string; data: any[] } | GroupedLog)[];
  log(...data: any[]): GroupedLog;
  labelledLog(label: string, ...data: any[]): GroupedLog;
  groupStart(title: string): GroupedLog;
  groupEnd(): GroupedLog;
};

export function isGroupedLog(data: unknown): data is GroupedLog {
  return isObject(data) && data[GROUPED_LOG];
}

export function createGroupedLog(title: string, parent?: GroupedLog): GroupedLog {
  const logs: GroupedLog['logs'] = [];

  const group: GroupedLog = {
    [GROUPED_LOG]: true,
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
      return createGroupedLog(title, group);
    },
    groupEnd() {
      parent?.logs.push(group);
      return parent ?? group;
    },
  };

  return group;
}
