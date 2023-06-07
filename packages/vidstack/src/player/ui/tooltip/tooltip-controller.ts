import { provideContext } from 'maverick.js';
import { ComponentController, ComponentInstance } from 'maverick.js/element';
import { setAttribute } from 'maverick.js/std';

import { tooltipContext } from './context';

let id = 0;

export class TooltipController extends ComponentController {
  constructor(instance: ComponentInstance) {
    super(instance);
    provideContext(tooltipContext, {
      _attachTooltip: this._attachTooltip.bind(this),
    });
  }

  protected _attachTooltip(tooltipEl: HTMLElement) {
    const tooltipId = `media-tooltip-${++id}`;
    setAttribute(this.el!, 'aria-describedby', tooltipId);
    setAttribute(tooltipEl, 'id', tooltipId);
    setAttribute(tooltipEl, 'role', 'tooltip');
    this.el!.removeAttribute('aria-label');
  }
}
