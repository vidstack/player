import { FullscreenButtonElement } from '../ui/fullscreen-button/FullscreenButtonElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-fullscreen-button', FullscreenButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fullscreen-button': FullscreenButtonElement;
  }
}
