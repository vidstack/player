// ** Dependencies **
import '../toggle/vds-toggle';
import '../button/vds-button';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { TOGGLE_BUTTON_ELEMENT_TAG_NAME } from './toggle-button.types';
import { ToggleButtonElement } from './ToggleButtonElement';

export const VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${TOGGLE_BUTTON_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME,
  ToggleButtonElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME]: ToggleButtonElement;
  }
}
