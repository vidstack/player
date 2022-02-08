import { TimeElement } from '../ui/time';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-time', TimeElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time': TimeElement;
  }
}
