import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from './MediaControllerElement';

window.customElements.define(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_CONTROLLER_ELEMENT_TAG_NAME]: MediaControllerElement;
  }
}
