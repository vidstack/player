import {
  MediaControllerElement,
  VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME
} from './MediaControllerElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME]: MediaControllerElement;
  }
}
