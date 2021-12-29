import { safelyDefineCustomElement } from '../../utils/dom';
import { PlayButtonElement } from './PlayButtonElement';

safelyDefineCustomElement('vds-play-button', PlayButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-play-button': PlayButtonElement;
  }
}
