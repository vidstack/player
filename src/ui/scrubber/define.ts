import { safelyDefineCustomElement } from '../../utils/dom';
import { SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement } from './ScrubberElement';

safelyDefineCustomElement(SCRUBBER_ELEMENT_TAG_NAME, ScrubberElement);

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_ELEMENT_TAG_NAME]: ScrubberElement;
  }
}
