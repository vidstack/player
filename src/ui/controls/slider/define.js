import { safelyDefineCustomElement } from '../../../utils/dom';
import { SliderElement, VDS_SLIDER_ELEMENT_TAG_NAME } from './SliderElement';

safelyDefineCustomElement(VDS_SLIDER_ELEMENT_TAG_NAME, SliderElement);
