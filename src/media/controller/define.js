import { safelyDefineCustomElement } from '@utils/dom.js';
import {
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
} from './MediaControllerElement.js';

safelyDefineCustomElement(
  MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement
);
