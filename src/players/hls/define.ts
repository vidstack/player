import { safelyDefineCustomElement } from '../../utils/dom';
import { HlsPlayerElement } from './HlsPlayerElement';

safelyDefineCustomElement('vds-hls-player', HlsPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-hls-player': HlsPlayerElement;
  }
}
