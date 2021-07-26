import {
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
} from './FullscreenButtonElement';

window.customElements.define(
  FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement
);

declare global {
  interface HTMLElementTagNameMap {
    [FULLSCREEN_BUTTON_ELEMENT_TAG_NAME]: FullscreenButtonElement;
  }
}
