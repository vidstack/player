// ** Dependencies **
import '../time-current/vds-time-current';
import '../time-duration/vds-time-duration';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { TimeProgress } from './TimeProgress';

export const TIME_PROGRESS_TAG_NAME = `${LIB_PREFIX}-time-progress`;

safelyDefineCustomElement(TIME_PROGRESS_TAG_NAME, TimeProgress);

declare global {
  interface HTMLElementTagNameMap {
    'vds-time-progress': TimeProgress;
  }
}
