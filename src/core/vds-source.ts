import { safelyDefineCustomElement } from '../utils';
import { Source } from './Source';
import { LIB_PREFIX } from '../shared/constants';

export const SOURCE_TAG_NAME = `${LIB_PREFIX}-source`;

safelyDefineCustomElement(SOURCE_TAG_NAME, Source);

declare global {
  interface HTMLElementTagNameMap {
    'vds-source': Source;
  }
}
