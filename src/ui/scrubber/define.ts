import { SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement } from './ScrubberElement';

window.customElements.define(SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement);

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_ELEMENT_TAG_NAME]: ScrubberElement;
  }
}
