import { safelyDefineCustomElement } from '@utils/dom';

import {
  VOLUME_SLIDER_ELEMENT_TAG_NAME,
  VolumeSliderElement
} from './VolumeSliderElement';

safelyDefineCustomElement(VOLUME_SLIDER_ELEMENT_TAG_NAME, VolumeSliderElement);

declare global {
  interface HTMLElementTagNameMap {
    [VOLUME_SLIDER_ELEMENT_TAG_NAME]: VolumeSliderElement;
  }
}
