import { safelyDefineCustomElement } from '../../utils/dom';
import {
  ASPECT_RATIO_ELEMENT_TAG_NAME,
  AspectRatioElement
} from './AspectRatioElement';

safelyDefineCustomElement(ASPECT_RATIO_ELEMENT_TAG_NAME, AspectRatioElement);

declare global {
  interface HTMLElementTagNameMap {
    [ASPECT_RATIO_ELEMENT_TAG_NAME]: AspectRatioElement;
  }
}
