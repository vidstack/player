import { safelyDefineCustomElement } from '../../utils/dom';
import {
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
} from './FullscreenButtonElement';

safelyDefineCustomElement(
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
);

declare global {
  interface HTMLElementTagNameMap {
    [FULLSCREEN_BUTTON_ELEMENT_TAG_NAME]: FullscreenButtonElement;
  }
}
