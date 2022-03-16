import './vds-media-ui';

import { safelyDefineCustomElement } from '@vidstack/foundation';

import { VideoPlayerElement } from '../players/video/VideoPlayerElement';

safelyDefineCustomElement('vds-video-player', VideoPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-video-player': VideoPlayerElement;
  }
}
