import { safelyDefineCustomElement } from '../../utils/dom';
import { TimeDurationElement } from './TimeDurationElement';

safelyDefineCustomElement('vds-time-duration', TimeDurationElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time-duration': TimeDurationElement;
  }
}
