import { MediaUiElement } from '../media/ui/MediaUiElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-media-ui', MediaUiElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-ui': MediaUiElement;
  }
}
