// ** Dependencies **
import '../toggle/vds-toggle';
import '../button/vds-button';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { MUTE_BUTTON_ELEMENT_TAG_NAME } from './mute-button.types';
import { MuteButtonElement } from './MuteButtonElement';

export const VDS_MUTE_BUTTON_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${MUTE_BUTTON_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(VDS_MUTE_BUTTON_ELEMENT_TAG_NAME, MuteButtonElement);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_MUTE_BUTTON_ELEMENT_TAG_NAME]: MuteButtonElement;
  }
}
