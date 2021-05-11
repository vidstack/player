import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { MEDIA_UI_ELEMENT_TAG_NAME } from './media-ui.types';
import { MediaUiElement } from './MediaUiElement';

export const VDS_MEDIA_UI_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${MEDIA_UI_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(VDS_MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_MEDIA_UI_ELEMENT_TAG_NAME]: MediaUiElement;
  }
}
