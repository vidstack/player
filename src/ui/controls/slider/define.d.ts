import { SliderElement, VDS_SLIDER_ELEMENT_TAG_NAME } from './SliderElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [VDS_SLIDER_ELEMENT_TAG_NAME]: SliderElement;
  }
}
