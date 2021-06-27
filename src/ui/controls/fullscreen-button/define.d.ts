import {
  FullscreenButtonElement,
  VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME
} from './FullscreenButtonElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME]: FullscreenButtonElement;
  }
}
