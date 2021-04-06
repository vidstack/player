import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { Control } from './Control';

export const CONTROL_TAG_NAME = `${LIB_PREFIX}-control` as const;

safelyDefineCustomElement(CONTROL_TAG_NAME, Control);

declare global {
  interface HTMLElementTagNameMap {
    [CONTROL_TAG_NAME]: Control;
  }
}
