import { safelyDefineCustomElement } from '../../../utils/dom.js';
import {
  FullscreenButtonElement,
  VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME
} from './FullscreenButtonElement.js';

safelyDefineCustomElement(
  VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
);
