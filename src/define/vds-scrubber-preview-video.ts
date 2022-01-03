import { ScrubberPreviewVideoElement } from '../ui/scrubber-preview-video/ScrubberPreviewVideoElement';
import { safelyDefineCustomElement } from '../utils/dom';

safelyDefineCustomElement(
  'vds-scrubber-preview-video',
  ScrubberPreviewVideoElement
);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber-preview-video': ScrubberPreviewVideoElement;
  }
}
