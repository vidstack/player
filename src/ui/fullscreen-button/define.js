import { safelyDefineCustomElement } from '@utils/dom.js';
import {
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
} from './FullscreenButtonElement.js';

safelyDefineCustomElement(
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
);
