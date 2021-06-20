import { safelyDefineCustomElement } from '../../../utils/dom.js';
import { SliderElement, VDS_SLIDER_ELEMENT_TAG_NAME } from './SliderElement.js';

safelyDefineCustomElement(VDS_SLIDER_ELEMENT_TAG_NAME, SliderElement);
