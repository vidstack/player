import { safelyDefineCustomElement } from '../../utils/dom';
import { BufferingIndicatorElement } from './BufferingIndicatorElement';

safelyDefineCustomElement('vds-buffering-indicator', BufferingIndicatorElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-buffering-indicator': BufferingIndicatorElement;
  }
}
