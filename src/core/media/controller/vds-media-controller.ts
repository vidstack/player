import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { MEDIA_CONTROLLER_ELEMENT_TAG_NAME } from './media-controller.types';
import { MediaControllerElement } from './MediaControllerElement';

export const VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${MEDIA_CONTROLLER_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME,
  MediaControllerElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_MEDIA_CONTROLLER_ELEMENT_TAG_NAME]: MediaControllerElement;
  }
}
