import { AudioElement } from '../providers/audio/AudioElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-audio', AudioElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio': AudioElement;
  }
}
