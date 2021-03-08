import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { TimeCurrent } from './TimeCurrent';

export const TIME_CURRENT_TAG_NAME = `${LIB_PREFIX}-time-current`;

safelyDefineCustomElement(TIME_CURRENT_TAG_NAME, TimeCurrent);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time-current': TimeCurrent;
  }
}
