import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  VOLUME_SLIDER_ELEMENT_TAG_NAME,
  VolumeSliderElement
} from './VolumeSliderElement.js';

safelyDefineCustomElement(VOLUME_SLIDER_ELEMENT_TAG_NAME, VolumeSliderElement);
