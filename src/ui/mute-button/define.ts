import { safelyDefineCustomElement } from '../../utils/dom';
import { MuteButtonElement } from './MuteButtonElement';

safelyDefineCustomElement('vds-mute-button', MuteButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-mute-button': MuteButtonElement;
  }
}
