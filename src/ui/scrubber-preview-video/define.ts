import { safelyDefineCustomElement } from '@utils/dom';

import {
  SCRUBBER_PREVIEW_VIDEO_ELEMENT_TAG_NAME,
  ScrubberPreviewVideoElement
} from './ScrubberPreviewVideoElement';

safelyDefineCustomElement(
  SCRUBBER_PREVIEW_VIDEO_ELEMENT_TAG_NAME,
  ScrubberPreviewVideoElement
);

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_PREVIEW_VIDEO_ELEMENT_TAG_NAME]: ScrubberPreviewVideoElement;
  }
}
