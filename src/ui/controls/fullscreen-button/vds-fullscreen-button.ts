// ** Dependencies **
import '../toggle/vds-toggle';
import '../button/vds-button';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from './fullscreen-button.types';
import { FullscreenButtonElement } from './FullscreenButtonElement';

export const VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${FULLSCREEN_BUTTON_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
  FullscreenButtonElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME]: FullscreenButtonElement;
  }
}
