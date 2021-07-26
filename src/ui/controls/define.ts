import { safelyDefineCustomElement } from '@utils/dom';

import { CONTROLS_ELEMENT_TAG_NAME, ControlsElement } from './ControlsElement';

safelyDefineCustomElement(CONTROLS_ELEMENT_TAG_NAME, ControlsElement);

declare global {
  interface HTMLElementTagNameMap {
    [CONTROLS_ELEMENT_TAG_NAME]: ControlsElement;
  }
}
