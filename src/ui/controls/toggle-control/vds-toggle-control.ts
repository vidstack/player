// ** Dependencies **
import '../toggle/vds-toggle';
import '../control/vds-control';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { ToggleControl } from './ToggleControl';

export const TOGGLE_CONTROL_TAG_NAME = `${LIB_PREFIX}-toggle-control` as const;

safelyDefineCustomElement(TOGGLE_CONTROL_TAG_NAME, ToggleControl);

declare global {
  interface HTMLElementTagNameMap {
    [TOGGLE_CONTROL_TAG_NAME]: ToggleControl;
  }
}
