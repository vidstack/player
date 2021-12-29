import { safelyDefineCustomElement } from '../../utils/dom';
import { AudioElement } from './AudioElement';

safelyDefineCustomElement('vds-audio', AudioElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio': AudioElement;
  }
}
