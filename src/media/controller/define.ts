import { safelyDefineCustomElement } from '../../utils/dom';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from './MediaControllerElement';

safelyDefineCustomElement(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_CONTROLLER_ELEMENT_TAG_NAME]: MediaControllerElement;
  }
}
