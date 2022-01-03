import { PlayButtonElement } from '../ui/play-button/PlayButtonElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-play-button', PlayButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-play-button': PlayButtonElement;
  }
}
