/** c8 ignore start */

import type { ReactiveControllerHost } from 'lit';

import { LogDispatcher } from './LogDispatcher';

export function logElementLifecycle(
  _host: ReactiveControllerHost & EventTarget
) {
  const logger = new LogDispatcher(_host);

  _host.addController({
    hostConnected() {
      logger.debug('🔗 connected');
    },
    hostUpdated() {
      logger.debug('🔄 updated');
    },
    hostDisconnected() {
      logger.debug('🗑️ disconnected');
    }
  });
}

/** c8 ignore stop */
