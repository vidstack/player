import { isNumber, isUndefined } from 'maverick.js/std';

/**
 * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
 * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
 * resolve that by retreiving time updates in a request animation frame loop.
 */
export function useRAFLoop(callback: () => void) {
  let id: number | undefined;

  function start() {
    // Time updates are already in progress.
    if (!isUndefined(id)) return;
    loop();
  }

  function loop() {
    id = window.requestAnimationFrame(() => {
      if (isUndefined(id)) return;
      callback();
      loop();
    });
  }

  function stop() {
    if (isNumber(id)) window.cancelAnimationFrame(id);
    id = undefined;
  }

  return {
    start,
    stop,
  };
}
