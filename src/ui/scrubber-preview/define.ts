import { safelyDefineCustomElement } from '../../utils/dom';
import {
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
} from './ScrubberPreviewElement';

safelyDefineCustomElement(
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
);

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_PREVIEW_ELEMENT_TAG_NAME]: ScrubberPreviewElement;
  }
}
