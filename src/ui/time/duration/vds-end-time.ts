import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { Duration } from './Duration';

export const DURATION_TAG_NAME = `${LIB_PREFIX}-duration`;

safelyDefineCustomElement(DURATION_TAG_NAME, Duration);

declare global {
  interface HTMLElementTagNameMap {
    'vds-duration': Duration;
  }
}
