import './vds-media-ui';

import { safelyDefineCustomElement } from '@vidstack/foundation';

import { VideoPlayerElement } from '../players/video/VideoPlayerElement';

safelyDefineCustomElement('vds-video-player', VideoPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-video-player': VideoPlayerElement;
  }
}

if (__DEV__) {
  // TODO: add release notes link.
  console.warn('`<vds-video-player>` has been deprecated and will be removed in 1.0.');
}
