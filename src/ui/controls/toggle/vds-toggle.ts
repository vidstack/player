import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { Toggle } from './Toggle';

export const TOGGLE_TAG_NAME = `${LIB_PREFIX}-toggle`;

safelyDefineCustomElement(TOGGLE_TAG_NAME, Toggle);

declare global {
  interface HTMLElementTagNameMap {
    'vds-toggle': Toggle;
  }
}
