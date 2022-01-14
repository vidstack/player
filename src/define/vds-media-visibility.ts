import { MediaVisibilityElement } from '../media/manage';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-media-visibility', MediaVisibilityElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-visibility': MediaVisibilityElement;
  }
}
