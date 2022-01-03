import { ScrubberPreviewElement } from '../ui/scrubber-preview/ScrubberPreviewElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement('vds-scrubber-preview', ScrubberPreviewElement);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber-preview': ScrubberPreviewElement;
  }
}
