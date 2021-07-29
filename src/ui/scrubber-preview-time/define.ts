import { safelyDefineCustomElement } from '../../utils/dom';
import {
  SCRUBBER_PREVIEW_TIME_ELEMENT_TAG_NAME,
  ScrubberPreviewTimeElement
} from './ScrubberPreviewTimeElement';

safelyDefineCustomElement(
  SCRUBBER_PREVIEW_TIME_ELEMENT_TAG_NAME,
  ScrubberPreviewTimeElement
);

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_PREVIEW_TIME_ELEMENT_TAG_NAME]: ScrubberPreviewTimeElement;
  }
}
