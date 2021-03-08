import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { CurrentTime } from './CurrentTime';

export const CURRENT_TIME_TAG_NAME = `${LIB_PREFIX}-current-time`;

safelyDefineCustomElement(CURRENT_TIME_TAG_NAME, CurrentTime);

declare global {
  interface HTMLElementTagNameMap {
    'vds-current-time': CurrentTime;
  }
}
