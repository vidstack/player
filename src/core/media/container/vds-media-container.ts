import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { MEDIA_CONTAINER_ELEMENT_TAG_NAME } from './media-container.types';
import { MediaContainerElement } from './MediaContainerElement';

export const VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${MEDIA_CONTAINER_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME,
  MediaContainerElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_MEDIA_CONTAINER_ELEMENT_TAG_NAME]: MediaContainerElement;
  }
}
