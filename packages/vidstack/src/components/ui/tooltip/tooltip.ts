import { Component, effect, provideContext, signal } from 'maverick.js';
import { EventsController, listenEvent, setAttribute } from 'maverick.js/std';

import { $keyboard, FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { setAttributeIfEmpty } from '../../../utils/dom';
import { Popper } from '../popper/popper';
import { tooltipContext, type TooltipContext } from './tooltip-context';

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
    showDelay: 700,
  };

  #id = `media-tooltip-${++id}`;

  #trigger = signal<HTMLElement | null>(null);
  #content = signal<HTMLElement | null>(null);
  #showing = signal(false);

  constructor() {
    super();

    new FocusVisibleController();

    const { showDelay } = this.$props;

    new Popper({
      trigger: this.#trigger,
      content: this.#content,
      showDelay: showDelay,
      listen(trigger, show, hide) {
        effect(() => {
          if ($keyboard()) listenEvent(trigger, 'focus', show);
          listenEvent(trigger, 'blur', hide);
        });

        new EventsController(trigger)
          .add('touchstart', (e) => e.preventDefault(), { passive: false })
          .add('mouseenter', show)
          .add('mouseleave', hide);
      },

      onChange: this.#onShowingChange.bind(this),
    });
  }

  protected override onAttach(el: HTMLElement): void {
    el.style.setProperty('display', 'contents');
  }

  protected override onSetup(): void {
    provideContext(tooltipContext, {
      trigger: this.#trigger,
      content: this.#content,
      showing: this.#showing,
      attachTrigger: this.#attachTrigger.bind(this),
      detachTrigger: this.#detachTrigger.bind(this),
      attachContent: this.#attachContent.bind(this),
      detachContent: this.#detachContent.bind(this),
    });
  }

  #attachTrigger(el: HTMLElement) {
    this.#trigger.set(el);

    let tooltipName = el.getAttribute('data-media-tooltip');
    if (tooltipName) {
      this.el?.setAttribute(`data-media-${tooltipName}-tooltip`, '');
    }

    setAttribute(el, 'data-describedby', this.#id);
  }

  #detachTrigger(el: HTMLElement) {
    el.removeAttribute('data-describedby');
    el.removeAttribute('aria-describedby');
    this.#trigger.set(null);
  }

  #attachContent(el: HTMLElement) {
    el.setAttribute('id', this.#id);
    el.style.display = 'none';

    setAttributeIfEmpty(el, 'role', 'tooltip');

    this.#content.set(el);
  }

  #detachContent(el: HTMLElement) {
    el.removeAttribute('id');
    el.removeAttribute('role');
    this.#content.set(null);
  }

  #onShowingChange(isShowing: boolean) {
    const trigger = this.#trigger(),
      content = this.#content();

    if (trigger) {
      setAttribute(trigger, 'aria-describedby', isShowing ? this.#id : null);
    }

    for (const el of [this.el, trigger, content]) {
      el && setAttribute(el, 'data-visible', isShowing);
    }

    this.#showing.set(isShowing);
  }
}

export interface TooltipProps {
  /**
   * The amount of time in milliseconds to wait before showing a tooltip.
   */
  showDelay: number;
}
