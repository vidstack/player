import { onDispose, ViewController } from 'maverick.js';

export class IntersectionObserverController extends ViewController {
  #init: IntersectionObserverInit;
  #observer: IntersectionObserver | undefined;

  constructor(init: IntersectionObserverInit) {
    super();
    this.#init = init;
  }

  protected override onConnect(el: HTMLElement) {
    this.#observer = new IntersectionObserver((entries) => {
      this.#init.callback?.(entries, this.#observer!);
    }, this.#init);

    this.#observer.observe(el);

    onDispose(this.#onDisconnect.bind(this));
  }

  /**
   * Disconnect any active intersection observers.
   */
  #onDisconnect(): void {
    this.#observer?.disconnect();
    this.#observer = undefined;
  }
}

export interface IntersectionObserverInit {
  /**
   * The element that is used as the viewport for checking visibility of the target. Must be the
   * ancestor of the target. Defaults to the browser viewport if not specified or if `null`.
   */
  root?: Element | Document | null;
  /**
   * Margin around the root. Can have values similar to the CSS margin property, e.g.
   * "10px 20px 30px 40px" (top, right, bottom, left). The values can be percentages. This set
   * of values serves to grow or shrink each side of the root element's bounding box before
   * computing intersections. Defaults to all zeros.
   */
  rootMargin?: string;
  /**
   * Either a single number or an array of numbers which indicate at what percentage of the
   * target's visibility the observer's callback should be executed. If you only want to detect
   * when visibility passes the `50%` mark, you can use a value of `0.5`. If you want the callback
   * to run every time visibility passes another `25%`, you would specify the array
   * `[0, 0.25, 0.5, 0.75, 1]`.
   *
   * The default is `0` (meaning as soon as even one pixel is visible, the callback will be run).
   * A value of `1.0` means that the threshold isn't considered passed until every pixel is
   * visible.
   */
  threshold?: number | number[];
  /**
   * Invoked when an intersection event occurs.
   */
  callback?: IntersectionObserverCallback;
}
