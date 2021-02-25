import { LIB_PREFIX } from '../../core';
import { safelyDefineCustomElement } from '../../utils';
import { MediaFileProvider } from './MediaFileProvider';

export const PLAYER_TAG_NAME = `${LIB_PREFIX}-file`;

safelyDefineCustomElement(PLAYER_TAG_NAME, MediaFileProvider);

declare global {
  interface HTMLElementTagNameMap {
    'vds-file': MediaFileProvider;
  }
}
