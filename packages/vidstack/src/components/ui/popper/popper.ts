import { effect, peek, ViewController, type Dispose, type ReadSignal } from 'maverick.js';
import { listenEvent } from 'maverick.js/std';
import { hasAnimation } from '../../../utils/dom';

export interface PopperDelegate {
  _showDelay?: ReadSignal<number>;
  _trigger: ReadSignal<HTMLElement | null>;
  _content: ReadSignal<HTMLElement | null>;
  _listen(
    trigger: HTMLElement,
    show: (trigger?: Event) => void,
    hide: (trigger?: Event) => void,
  ): void;
  _onChange(isShowing: boolean, trigger?: Event): void;
}

export class Popper extends ViewController {
  constructor(private _delegate: PopperDelegate) {
    super();

    effect(this._watchTrigger.bind(this));
  }

  protected override onDestroy(): void {
    this._stopAnimationEndListener?.();
    this._stopAnimationEndListener = null;
  }

  private _watchTrigger() {
    const trigger = this._delegate._trigger();

    if (!trigger) {
      this.hide();
      return;
    }

    const show = this.show.bind(this),
      hide = this.hide.bind(this);
    this._delegate._listen(trigger, show, hide);
  }

  private _showTimerId = -1;
  private _hideRafId = -1;
  private _stopAnimationEndListener: Dispose | null = null;

  show(trigger?: Event) {
    window.cancelAnimationFrame(this._hideRafId);
    this._hideRafId = -1;

    this._stopAnimationEndListener?.();
    this._stopAnimationEndListener = null;

    this._showTimerId = window.setTimeout(
      () => {
        this._showTimerId = -1;

        const content = this._delegate._content();
        if (content) content.style.removeProperty('display');

        peek(() => this._delegate._onChange(true, trigger));
      },
      this._delegate._showDelay?.() ?? 0,
    );
  }

  hide(trigger?: Event) {
    window.clearTimeout(this._showTimerId);
    this._showTimerId = -1;

    peek(() => this._delegate._onChange(false, trigger));

    this._hideRafId = requestAnimationFrame(() => {
      this._hideRafId = -1;
      const content = this._delegate._content();
      if (content) {
        const isAnimated = hasAnimation(content);

        const onHide = () => {
          content.style.display = 'none';
          this._stopAnimationEndListener = null;
        };

        if (isAnimated) {
          this._stopAnimationEndListener?.();
          const stop = listenEvent(content, 'animationend', onHide, { once: true });
          this._stopAnimationEndListener = stop;
        } else {
          onHide();
        }
      }
    });
  }
}
