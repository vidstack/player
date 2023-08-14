import { Host } from 'maverick.js/element';
import { ToggleButton } from '../../../components';
import { StateController } from '../../state-controller';

/**
 * @example
 * ```html
 * <media-toggle-button aria-label="...">
 *   <svg data-state="on">...</svg>
 *   <svg data-state="off">...</svg>
 * </media-toggle-button>
 * ```
 */
export class MediaToggleButtonElement extends Host(HTMLElement, ToggleButton) {
  static tagName = 'media-toggle-button';

  protected onConnect() {
    new StateController(this, () => {
      const isOn = this.pressed;
      return { on: !isOn, off: isOn };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'media-toggle-button': MediaToggleButtonElement;
  }
}
