import { safelyDefineCustomElement } from '@utils/dom';

import {
  MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerElement
} from './MediaContainerElement';

safelyDefineCustomElement(
  MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerElement
);

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_CONTAINER_ELEMENT_TAG_NAME]: MediaContainerElement;
  }
}
