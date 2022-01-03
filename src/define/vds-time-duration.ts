import { TimeDurationElement } from '../ui/time-duration/TimeDurationElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-time-duration', TimeDurationElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time-duration': TimeDurationElement;
  }
}
