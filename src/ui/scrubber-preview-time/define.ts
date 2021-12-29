import { safelyDefineCustomElement } from '../../utils/dom';
import { ScrubberPreviewTimeElement } from './ScrubberPreviewTimeElement';

safelyDefineCustomElement(
  'vds-scrubber-preview-time',
  ScrubberPreviewTimeElement
);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber-preview-time': ScrubberPreviewTimeElement;
  }
}
