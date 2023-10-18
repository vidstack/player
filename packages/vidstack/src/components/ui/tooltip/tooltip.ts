import { Component, provideContext, signal } from 'maverick.js';
import { listenEvent, setAttribute } from 'maverick.js/std';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { Popper } from '../popper/popper';
import { tooltipContext } from './tooltip-context';

let id = 0;

/**
 * A contextual text bubble that displays a description for an element that appears on pointer
 * hover or keyboard focus.
 *
 * @attr data-visible - Whether tooltip is visible.
 * @attr data-hocus - Whether tooltip is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/tooltip}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role}
 */
export class Tooltip extends Component<TooltipProps> {
  static props: TooltipProps = {
    showDelay: 500,
  };

  private _id = `media-tooltip-${++id}`;
  private _trigger = signal<HTMLElement | null>(null);
  private _content = signal<HTMLElement | null>(null);

  constructor() {
    super();

    new FocusVisibleController();

    const { showDelay } = this.$props;
    new Popper({
      _trigger: this._trigger,
      _content: this._content,
      _showDelay: showDelay,
      _listen(trigger, show, hide) {
        listenEvent(trigger, 'touchstart', (e) => e.preventDefault(), {
          passive: false,
        });

        listenEvent(trigger, 'focus', show);
        listenEvent(trigger, 'blur', hide);

        listenEvent(trigger, 'mouseenter', show);
        listenEvent(trigger, 'mouseleave', hide);
      },
      _onChange: this._onShowingChange.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.setProperty('display', 'contents');
  }

  protected override onSetup(): void {
    provideContext(tooltipContext, {
      _trigger: this._trigger,
      _content: this._content,
      _attachTrigger: this._attachTrigger.bind(this),
      _detachTrigger: this._detachTrigger.bind(this),
      _attachContent: this._attachContent.bind(this),
      _detachContent: this._detachContent.bind(this),
    });
  }

  private _attachTrigger(el: HTMLElement) {
    this._trigger.set(el);

    let tooltipName = el.getAttribute('data-media-tooltip');
    if (tooltipName) {
      this.el?.setAttribute(`data-media-${tooltipName}-tooltip`, '');
    }

    setAttribute(el, 'data-describedby', this._id);
  }

  private _detachTrigger(el: HTMLElement) {
    el.removeAttribute('data-describedby');
    el.removeAttribute('aria-describedby');
    this._trigger.set(null);
  }

  private _attachContent(el: HTMLElement) {
    el.setAttribute('id', this._id);
    el.style.display = 'none';

    setAttributeIfEmpty(el, 'role', 'tooltip');

    this._content.set(el);
  }

  private _detachContent(el: HTMLElement) {
    el.removeAttribute('id');
    el.removeAttribute('role');
    this._content.set(null);
  }

  private _onShowingChange(isShowing: boolean) {
    const trigger = this._trigger(),
      content = this._content();

    if (trigger) {
      setAttribute(trigger, 'aria-describedby', isShowing ? this._id : null);
    }

    for (const el of [this.el, trigger, content]) {
      el && setAttribute(el, 'data-visible', isShowing);
    }
  }
}

export interface TooltipProps {
  /**
   * The amount of time in milliseconds to wait before showing a tooltip.
   */
  showDelay: number;
}
