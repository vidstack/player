import { safelyDefineCustomElement } from '../../utils/dom';
import { VideoElement } from './VideoElement';

safelyDefineCustomElement('vds-video', VideoElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-video': VideoElement;
  }
}
