import { safelyDefineCustomElement } from '../../utils/dom';
import { MediaPlayerElement } from './MediaPlayerElement';

safelyDefineCustomElement('vds-media-player', MediaPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-player': MediaPlayerElement;
  }
}
