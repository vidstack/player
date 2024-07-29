import { Component, onDispose, useContext } from 'maverick.js';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { requestScopedAnimationFrame } from '../../../utils/dom';
import { tooltipContext } from './tooltip-context';

/**
 * Wraps the element that will trigger showing/hiding the tooltip on hover or keyboard focus. The
 * tooltip content is positioned relative to this element.
 *
 * @attr data-visible - Whether tooltip is visible.
 * @attr data-hocus - Whether tooltip is being keyboard focused or hovered over.
 * @docs {@link https://www.vidstack.io/docs/player/components/tooltip}
 */
export class TooltipTrigger extends Component {
  constructor() {
    super();
    new FocusVisibleController();
  }

  protected override onConnect(el: HTMLElement): void {
    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        this.#attach();
        const tooltip = useContext(tooltipContext);
        onDispose(() => {
          const button = this.#getButton();
          button && tooltip.detachTrigger(button);
        });
      }),
    );
  }

  #attach() {
    const button = this.#getButton(),
      tooltip = useContext(tooltipContext);
    button && tooltip.attachTrigger(button);
  }

  #getButton() {
    const candidate = this.el!.firstElementChild;
    return (
      candidate?.localName === 'button' || candidate?.getAttribute('role') === 'button'
        ? candidate
        : this.el!
    ) as HTMLElement | null;
  }
}
