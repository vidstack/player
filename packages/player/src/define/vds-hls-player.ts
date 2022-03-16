import './vds-media-ui';

import { safelyDefineCustomElement } from '@vidstack/foundation';

import { HlsPlayerElement } from '../players/hls/HlsPlayerElement';

safelyDefineCustomElement('vds-hls-player', HlsPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-hls-player': HlsPlayerElement;
  }
}
