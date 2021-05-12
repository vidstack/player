import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { TIME_PROGRESS_ELEMENT_TAG_NAME } from './time-progress.types';
import { TimeProgressElement } from './TimeProgressElement';

export const VDS_TIME_PROGRESS_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${TIME_PROGRESS_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(
  VDS_TIME_PROGRESS_ELEMENT_TAG_NAME,
  TimeProgressElement,
);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_TIME_PROGRESS_ELEMENT_TAG_NAME]: TimeProgressElement;
  }
}
