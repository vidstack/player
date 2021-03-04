import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { Control } from './Control';

export const CONTROL_TAG_NAME = `${LIB_PREFIX}-control`;

safelyDefineCustomElement(CONTROL_TAG_NAME, Control);

declare global {
  interface HTMLElementTagNameMap {
    'vds-control': Control;
  }
}
