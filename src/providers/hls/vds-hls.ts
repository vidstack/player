import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { HlsProvider } from './HlsProvider';

export const HLS_TAG_NAME = `${LIB_PREFIX}-hls` as const;

safelyDefineCustomElement(HLS_TAG_NAME, HlsProvider);

declare global {
  interface HTMLElementTagNameMap {
    [HLS_TAG_NAME]: HlsProvider;
  }
}
