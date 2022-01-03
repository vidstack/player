import { MuteButtonElement } from '../ui/mute-button/MuteButtonElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-mute-button', MuteButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-mute-button': MuteButtonElement;
  }
}
