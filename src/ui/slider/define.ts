import { safelyDefineCustomElement } from '../../utils/dom';
import { SLIDER_ELEMENT_TAG_NAME, SliderElement } from './SliderElement';

safelyDefineCustomElement(SLIDER_ELEMENT_TAG_NAME, SliderElement);

declare global {
  interface HTMLElementTagNameMap {
    [SLIDER_ELEMENT_TAG_NAME]: SliderElement;
  }
}
