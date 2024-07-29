import { isNumber, isUndefined } from 'maverick.js/std';

export class RAFLoop {
  #id: number | undefined;
  #callback: () => void;

  constructor(callback: () => void) {
    this.#callback = callback;
  }

  start() {
    // Time updates are already in progress.
    if (!isUndefined(this.#id)) return;
    this.#loop();
  }

  stop() {
    if (isNumber(this.#id)) window.cancelAnimationFrame(this.#id);
    this.#id = undefined;
  }

  #loop() {
    this.#id = window.requestAnimationFrame(() => {
      if (isUndefined(this.#id)) return;
      this.#callback();
      this.#loop();
    });
  }
}
