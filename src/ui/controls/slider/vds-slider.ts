import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { SLIDER_ELEMENT_TAG_NAME } from './slider.types';
import { SliderElement } from './SliderElement';

export const VDS_SLIDER_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${SLIDER_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(VDS_SLIDER_ELEMENT_TAG_NAME, SliderElement);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_SLIDER_ELEMENT_TAG_NAME]: SliderElement;
  }
}
