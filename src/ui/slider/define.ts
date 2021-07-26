import { SLIDER_ELEMENT_TAG_NAME, SliderElement } from './SliderElement';

window.customElements.define(SLIDER_ELEMENT_TAG_NAME, SliderElement);

declare global {
  interface HTMLElementTagNameMap {
    [SLIDER_ELEMENT_TAG_NAME]: SliderElement;
  }
}
