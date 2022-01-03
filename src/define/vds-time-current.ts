import { TimeCurrentElement } from '../ui/time-current/TimeCurrentElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-time-current', TimeCurrentElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time-current': TimeCurrentElement;
  }
}
