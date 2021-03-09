import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { BufferingIndicator } from './BufferingIndicator';

export const BUFFERING_INDICATOR_TAG_NAME = `${LIB_PREFIX}-buffering-indicator`;

safelyDefineCustomElement(BUFFERING_INDICATOR_TAG_NAME, BufferingIndicator);

declare global {
  interface HTMLElementTagNameMap {
    'vds-buffering-indicator': BufferingIndicator;
  }
}
