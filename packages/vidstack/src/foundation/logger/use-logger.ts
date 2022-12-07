import { effect, ReadSignal } from 'maverick.js';

import { createLogger, Logger } from './create-logger';

export function useLogger($target: ReadSignal<EventTarget | null>): Logger {
  const logger = createLogger();
  effect(() => logger.setTarget($target()));
  return logger;
}
