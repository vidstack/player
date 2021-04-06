// ** Dependencies **
import '../toggle/vds-toggle';
import '../control/vds-control';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { FullscreenToggle } from './FullscreenToggle';

export const FULLSCREEN_TOGGLE_TAG_NAME = `${LIB_PREFIX}-fullscreen-toggle` as const;

safelyDefineCustomElement(FULLSCREEN_TOGGLE_TAG_NAME, FullscreenToggle);

declare global {
  interface HTMLElementTagNameMap {
    [FULLSCREEN_TOGGLE_TAG_NAME]: FullscreenToggle;
  }
}
