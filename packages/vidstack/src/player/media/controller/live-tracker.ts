import { effect, peek } from 'maverick.js';

import type { MediaContext } from '../context';

export function useLiveTracker({ $store, $provider }: MediaContext) {
  let lastTime = -1,
    liveDelta = -1;

  effect(() => {
    if (!$store.live || $provider()?.canLiveSync) return;

    effect(() => {
      if (!$store.playing || !Number.isFinite($store.seekableEnd)) return;
      lastTime = -1;
      liveDelta = -1;
      const id = peek(() => setInterval(onInterval, 30));
      return () => clearInterval(id);
    });

    effect(() => {
      liveDelta = 0;
      onInterval();
    });
  });

  function onInterval() {
    const newTime = Number(window.performance.now().toFixed(4)),
      deltaTime = lastTime === -1 ? 0 : (newTime - lastTime) / 1000;
    liveDelta += deltaTime;
    $store.duration = liveDelta + $store.seekableEnd;
    lastTime = newTime;
  }
}
