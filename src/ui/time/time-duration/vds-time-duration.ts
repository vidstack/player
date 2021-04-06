import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { TimeDuration } from './TimeDuration';

export const TIME_DURATION_TAG_NAME = `${LIB_PREFIX}-time-duration` as const;

safelyDefineCustomElement(TIME_DURATION_TAG_NAME, TimeDuration);

declare global {
  interface HTMLElementTagNameMap {
    [TIME_DURATION_TAG_NAME]: TimeDuration;
  }
}
