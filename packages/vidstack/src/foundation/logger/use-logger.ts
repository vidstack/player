import { effect, ReadSignal } from 'maverick.js';

import { createLogger, Logger } from './create-logger';

export function useLogger($target: ReadSignal<EventTarget | null>): Logger | undefined {
  if (!__DEV__) return undefined;

  const logger = createLogger();
  effect(() => logger.setTarget($target()));
  return logger;
}
