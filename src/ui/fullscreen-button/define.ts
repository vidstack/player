import { safelyDefineCustomElement } from '../../utils/dom';
import { FullscreenButtonElement } from './FullscreenButtonElement';

safelyDefineCustomElement('vds-fullscreen-button', FullscreenButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-fullscreen-button': FullscreenButtonElement;
  }
}
