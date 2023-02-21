import { effect, peek } from 'maverick.js';

import type { MediaContext } from '../context';

export function useLiveTracker({ $store }: MediaContext) {
  let lastTime = -1;

  effect(() => {
    if (!$store.live) return;

    lastTime = -1;

    effect(() => {
      $store.seekableEnd;
      $store.liveDelta = 0;
      onInterval();
    });

    const id = setInterval(onInterval, 30);
    return () => clearInterval(id);
  });

  function onInterval() {
    const newTime = Number(window.performance.now().toFixed(4)),
      deltaTime = lastTime === -1 ? 0 : (newTime - lastTime) / 1000;
    $store.liveDelta = peek(() => $store.liveDelta) + deltaTime;
    lastTime = newTime;
  }
}
