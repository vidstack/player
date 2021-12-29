import { safelyDefineCustomElement } from '../../utils/dom';
import { MediaUiElement } from './MediaUiElement';

safelyDefineCustomElement('vds-media-ui', MediaUiElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-ui': MediaUiElement;
  }
}
