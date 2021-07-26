import {
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
} from './ScrubberPreviewElement';

window.customElements.define(
  SCRUBBER_PREVIEW_ELEMENT_TAG_NAME,
  ScrubberPreviewElement
);

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_PREVIEW_ELEMENT_TAG_NAME]: ScrubberPreviewElement;
  }
}
