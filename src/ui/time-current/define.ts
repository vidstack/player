import { safelyDefineCustomElement } from '../../utils/dom';
import { TimeCurrentElement } from './TimeCurrentElement';

safelyDefineCustomElement('vds-time-current', TimeCurrentElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time-current': TimeCurrentElement;
  }
}
