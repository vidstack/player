import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { Slider } from './Slider';

export const SLIDER_TAG_NAME = `${LIB_PREFIX}-slider` as const;

safelyDefineCustomElement(SLIDER_TAG_NAME, Slider);

declare global {
  interface HTMLElementTagNameMap {
    [SLIDER_TAG_NAME]: Slider;
  }
}
