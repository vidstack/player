import { MediaTextElement } from '../ui/media-text';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-media-text', MediaTextElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-media-text': MediaTextElement;
  }
}
