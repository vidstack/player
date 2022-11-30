import { peek } from 'maverick.js';
import { onConnect } from 'maverick.js/element';

import { RequestQueue } from './request-queue';

export function useHostedRequestQueue() {
  const queue = new RequestQueue();

  onConnect(() => {
    peek(() => queue.start());
    return () => queue.reset();
  });

  return queue;
}
