import { onAfterUpdate, onConnect, onMount } from 'maverick.js/element';

import { useHostedLogger } from './create-logger';

export function useLogLifecycle() {
  if (!__DEV__) return;

  const logger = useHostedLogger();

  onConnect(() => {
    logger?.debug('🔗 connected');
    return () => logger?.debug('🔗 disconnected');
  });

  onMount(() => {
    logger?.debug('🔗 mounted');
    return () => logger?.debug('🔗 destroyed');
  });

  onAfterUpdate(() => {
    logger?.debug('🔄 updated');
  });
}
