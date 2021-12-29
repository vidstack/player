import { safelyDefineCustomElement } from '../../utils/dom';
import { VideoPlayerElement } from './VideoPlayerElement';

safelyDefineCustomElement('vds-video-player', VideoPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-video-player': VideoPlayerElement;
  }
}
