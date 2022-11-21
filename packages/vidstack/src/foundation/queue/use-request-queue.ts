import { onConnect } from 'maverick.js/element';

import { RequestQueue } from './request-queue';

export function useHostedRequestQueue() {
  const queue = new RequestQueue();

  onConnect(() => {
    queue.start();
    return () => queue.destroy();
  });

  return queue;
}
