import { AudioPlayerElement } from '../players/audio/AudioPlayerElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-audio-player', AudioPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio-player': AudioPlayerElement;
  }
}
