import { BufferingIndicatorElement } from '../ui/buffering-indicator/BufferingIndicatorElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-buffering-indicator', BufferingIndicatorElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-buffering-indicator': BufferingIndicatorElement;
  }
}
