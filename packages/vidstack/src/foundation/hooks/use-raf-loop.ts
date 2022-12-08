import { isNumber, isUndefined } from 'maverick.js/std';

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
