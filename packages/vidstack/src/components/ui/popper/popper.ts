import { effect, peek, ViewController, type Dispose, type ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';

import { hasAnimation } from '../../../utils/dom';

export interface PopperDelegate {
  showDelay?: ReadSignal<number>;
  trigger: ReadSignal<HTMLElement | null>;
  content: ReadSignal<HTMLElement | null>;
  listen(
    trigger: HTMLElement,
    show: (trigger?: Event) => void,
    hide: (trigger?: Event) => void,
  ): void;
  onChange(isShowing: boolean, trigger?: Event): void;
}

export class Popper extends ViewController {
  #delegate: PopperDelegate;

  constructor(delegate: PopperDelegate) {
    super();
    this.#delegate = delegate;
    effect(this.#watchTrigger.bind(this));
  }

  protected override onDestroy(): void {
    this.#stopAnimationEndListener?.();
    this.#stopAnimationEndListener = null;
  }

  #watchTrigger() {
    const trigger = this.#delegate.trigger();

    if (!trigger) {
      this.hide();
      return;
    }

    const show = this.show.bind(this),
      hide = this.hide.bind(this);

    this.#delegate.listen(trigger, show, hide);
  }

  #showTimerId = -1;
  #hideRafId = -1;
  #stopAnimationEndListener: Dispose | null = null;

  show(trigger?: Event) {
    this.#cancelShowing();

    window.cancelAnimationFrame(this.#hideRafId);
    this.#hideRafId = -1;

    this.#stopAnimationEndListener?.();
    this.#stopAnimationEndListener = null;

    this.#showTimerId = window.setTimeout(() => {
      this.#showTimerId = -1;

      const content = this.#delegate.content();
      if (content) content.style.removeProperty('display');

      peek(() => this.#delegate.onChange(true, trigger));
    }, this.#delegate.showDelay?.() ?? 0);
  }

  hide(trigger?: Event) {
    this.#cancelShowing();

    peek(() => this.#delegate.onChange(false, trigger));

    this.#hideRafId = requestAnimationFrame(() => {
      this.#cancelShowing();
      this.#hideRafId = -1;

      const content = this.#delegate.content();

      if (content) {
        const onHide = () => {
          content.style.display = 'none';
          this.#stopAnimationEndListener = null;
        };

        const isAnimated = hasAnimation(content);

        if (isAnimated) {
          this.#stopAnimationEndListener?.();
          const stop = listenEvent(content, 'animationend', onHide, { once: true });
          this.#stopAnimationEndListener = stop;
        } else {
          onHide();
        }
      }
    });
  }

  #cancelShowing() {
    window.clearTimeout(this.#showTimerId);
    this.#showTimerId = -1;
  }
}
