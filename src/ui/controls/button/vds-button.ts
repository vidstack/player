import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { BUTTON_ELEMENT_TAG_NAME } from './button.types';
import { ButtonElement } from './ButtonElement';

export const VDS_BUTTON_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${BUTTON_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(VDS_BUTTON_ELEMENT_TAG_NAME, ButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_BUTTON_ELEMENT_TAG_NAME]: ButtonElement;
  }
}
