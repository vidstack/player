import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { UI_ELEMENT_TAG_NAME } from './ui.types';
import { UiElement } from './UiElement';

export const VDS_UI_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${UI_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(VDS_UI_ELEMENT_TAG_NAME, UiElement);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_UI_ELEMENT_TAG_NAME]: UiElement;
  }
}
