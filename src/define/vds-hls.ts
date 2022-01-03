import { HlsElement } from '../providers/hls/HlsElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-hls', HlsElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-hls': HlsElement;
  }
}
