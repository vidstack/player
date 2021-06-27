import { safelyDefineCustomElement } from '../../utils/dom.js';
import {
  MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerElement
} from './MediaContainerElement.js';

safelyDefineCustomElement(
  MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerElement
);
