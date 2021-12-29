import { safelyDefineCustomElement } from '../../utils/dom';
import { HlsElement } from './HlsElement';

safelyDefineCustomElement('vds-hls', HlsElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-hls': HlsElement;
  }
}
