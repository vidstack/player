import { safelyDefineCustomElement } from '../../utils/dom';
import { ScrubberPreviewVideoElement } from './ScrubberPreviewVideoElement';

safelyDefineCustomElement(
  'vds-scrubber-preview-video',
  ScrubberPreviewVideoElement
);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber-preview-video': ScrubberPreviewVideoElement;
  }
}
