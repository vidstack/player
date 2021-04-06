// ** Dependencies **
import '../toggle-control/vds-toggle-control';

import { LIB_PREFIX } from '../../../shared/constants';
import { safelyDefineCustomElement } from '../../../utils/dom';
import { PlaybackToggle } from './PlaybackToggle';

export const PLAYBACK_TOGGLE_TAG_NAME = `${LIB_PREFIX}-playback-toggle` as const;

safelyDefineCustomElement(PLAYBACK_TOGGLE_TAG_NAME, PlaybackToggle);

declare global {
  interface HTMLElementTagNameMap {
    [PLAYBACK_TOGGLE_TAG_NAME]: PlaybackToggle;
  }
}
