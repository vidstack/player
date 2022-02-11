import { MediaVisibilityElement } from '../media/manage/MediaVisibilityElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-media-visibility', MediaVisibilityElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-visibility': MediaVisibilityElement;
  }
}
