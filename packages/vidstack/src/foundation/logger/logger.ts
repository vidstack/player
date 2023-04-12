import { effect, type ReadSignal } from 'maverick.js';

import { createLogger, type Logger } from './create-logger';

const loggers = new WeakMap<ReadSignal<unknown>, Logger>();

export function useLogger($target: ReadSignal<EventTarget | null>): Logger | undefined {
  if (!__DEV__) return undefined;

  const logger = loggers.get($target) ?? createLogger();

  if (!loggers.has($target)) {
    effect(() => logger.setTarget($target()));
    loggers.set($target, logger);
  }

  return logger;
}
