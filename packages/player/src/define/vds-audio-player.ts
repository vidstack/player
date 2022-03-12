import './vds-media-ui';

import { safelyDefineCustomElement } from '@vidstack/foundation';

import { AudioPlayerElement } from '../players/audio/AudioPlayerElement.js';

safelyDefineCustomElement('vds-audio-player', AudioPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio-player': AudioPlayerElement;
  }
}
