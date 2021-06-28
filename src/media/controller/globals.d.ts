import { MediaProviderElement } from '../provider/index.js';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from './MediaControllerElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_CONTROLLER_ELEMENT_TAG_NAME]: MediaControllerElement;
  }
}

declare module './MediaControllerElement.js' {
  interface MediaControllerElement extends MediaProviderElement {}
}
