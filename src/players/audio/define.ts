import { safelyDefineCustomElement } from '../../utils/dom';
import { AudioPlayerElement } from './AudioPlayerElement';

safelyDefineCustomElement('vds-audio-player', AudioPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio-player': AudioPlayerElement;
  }
}
