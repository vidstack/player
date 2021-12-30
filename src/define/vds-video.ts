import { VideoElement } from '../providers/video/VideoElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-video', VideoElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-video': VideoElement;
  }
}
