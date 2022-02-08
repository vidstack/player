import { PosterElement } from '../ui/poster/PosterElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-poster', PosterElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-poster': PosterElement;
  }
}
