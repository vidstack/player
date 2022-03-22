import './vds-media-ui';

import { safelyDefineCustomElement } from '@vidstack/foundation';

import { HlsPlayerElement } from '../players/hls/HlsPlayerElement';

safelyDefineCustomElement('vds-hls-player', HlsPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-hls-player': HlsPlayerElement;
  }
}

if (__DEV__) {
  // TODO: add release notes link.
  console.warn('`<vds-hls-player>` has been deprecated and will be removed in 1.0.');
}
