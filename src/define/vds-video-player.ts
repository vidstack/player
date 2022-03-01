import './vds-media-ui';

import { VideoPlayerElement } from '../players/video/VideoPlayerElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-video-player', VideoPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-video-player': VideoPlayerElement;
  }
}
