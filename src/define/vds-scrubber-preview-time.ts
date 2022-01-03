import { ScrubberPreviewTimeElement } from '../ui/scrubber-preview-time/ScrubberPreviewTimeElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement(
  'vds-scrubber-preview-time',
  ScrubberPreviewTimeElement
);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber-preview-time': ScrubberPreviewTimeElement;
  }
}
