import './vds-media-ui';

import { safelyDefineCustomElement } from '@vidstack/foundation';

import { AudioPlayerElement } from '../players/audio/AudioPlayerElement';

safelyDefineCustomElement('vds-audio-player', AudioPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-audio-player': AudioPlayerElement;
  }
}

if (__DEV__) {
  // TODO: add release notes link.
  console.warn('`<vds-audio-player>` has been deprecated and will be removed in 1.0.');
}
