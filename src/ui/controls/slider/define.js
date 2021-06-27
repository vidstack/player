import { safelyDefineCustomElement } from '../../../utils/dom.js';
import { SLIDER_ELEMENT_TAG_NAME, SliderElement } from './SliderElement.js';

safelyDefineCustomElement(SLIDER_ELEMENT_TAG_NAME, SliderElement);
