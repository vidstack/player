import { HlsPlayerElement } from '../players/hls/HlsPlayerElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-hls-player', HlsPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-hls-player': HlsPlayerElement;
  }
}
