import { Component, onDispose, useContext } from 'maverick.js';

import { FocusVisibleController } from '../../../foundation/observers/focus-visible';
import { requestScopedAnimationFrame } from '../../../utils/dom';
import { tooltipContext } from './tooltip-context';

/**
 * Wraps the element that will trigger showing/hiding the tooltip on hover or keyboard focus. The
 * tooltip content is positioned relative to this element.
 *
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
        this._attach();
        const tooltip = useContext(tooltipContext);
        onDispose(() => {
          const button = this._getButton();
          button && tooltip._detachTrigger(button);
        });
      }),
    );
  }

  private _attach() {
    const button = this._getButton(),
      tooltip = useContext(tooltipContext);
    button && tooltip._attachTrigger(button);
  }

  private _getButton() {
    return (
      this.el!.firstElementChild?.getAttribute('role') === 'button'
        ? this.el!.firstElementChild
        : this.el!
    ) as HTMLElement | null;
  }
}
