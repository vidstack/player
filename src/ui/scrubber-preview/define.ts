import { safelyDefineCustomElement } from '../../utils/dom';
import { ScrubberPreviewElement } from './ScrubberPreviewElement';

safelyDefineCustomElement('vds-scrubber-preview', ScrubberPreviewElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber-preview': ScrubberPreviewElement;
  }
}
