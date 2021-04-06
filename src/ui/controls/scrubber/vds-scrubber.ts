// ** Dependencies **
import '../slider/vds-slider';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { Scrubber } from './Scrubber';

export const SCRUBBER_TAG_NAME = `${LIB_PREFIX}-scrubber` as const;

safelyDefineCustomElement(SCRUBBER_TAG_NAME, Scrubber);

declare global {
  interface HTMLElementTagNameMap {
    [SCRUBBER_TAG_NAME]: Scrubber;
  }
}
