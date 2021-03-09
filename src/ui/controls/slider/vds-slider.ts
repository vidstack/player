import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { Slider } from './Slider';

export const SLIDER_TAG_NAME = `${LIB_PREFIX}-slider`;

safelyDefineCustomElement(SLIDER_TAG_NAME, Slider);

declare global {
  interface HTMLElementTagNameMap {
    'vds-slider': Slider;
  }
}
