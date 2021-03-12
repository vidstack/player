// ** Dependencies **
import '../slider/vds-slider';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { Scrubber } from './Scrubber';

export const SCRUBBER_TAG_NAME = `${LIB_PREFIX}-scrubber`;

safelyDefineCustomElement(SCRUBBER_TAG_NAME, Scrubber);

declare global {
  interface HTMLElementTagNameMap {
    'vds-scrubber': Scrubber;
  }
}
