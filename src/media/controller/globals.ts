import { MediaProviderElement } from '../provider/MediaProviderElement.js';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from './MediaControllerElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_CONTROLLER_ELEMENT_TAG_NAME]: MediaControllerElement<MediaProviderElement>;
  }
}
