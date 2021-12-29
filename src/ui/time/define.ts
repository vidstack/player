import { safelyDefineCustomElement } from '../../utils/dom';
import { TimeElement } from './TimeElement';

safelyDefineCustomElement('vds-time', TimeElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time': TimeElement;
  }
}
