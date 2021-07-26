import {
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
} from './BufferingIndicatorElement';

window.customElements.define(
  BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
  BufferingIndicatorElement
);

declare global {
  interface HTMLElementTagNameMap {
    [BUFFERING_INDICATOR_ELEMENT_TAG_NAME]: BufferingIndicatorElement;
  }
}
