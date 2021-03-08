// ** Dependencies **
import '../toggle/vds-toggle';
import '../control/vds-control';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { MuteToggle } from './MuteToggle';

export const MUTE_TOGGLE_TAG_NAME = `${LIB_PREFIX}-mute-toggle`;

safelyDefineCustomElement(MUTE_TOGGLE_TAG_NAME, MuteToggle);

declare global {
  interface HTMLElementTagNameMap {
    'vds-mute-toggle': MuteToggle;
  }
}
