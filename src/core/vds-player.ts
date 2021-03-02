import { LIB_PREFIX } from '../shared/constants';
import { safelyDefineCustomElement } from '../utils/dom';
import { Player } from './Player';

export const PLAYER_TAG_NAME = `${LIB_PREFIX}-player`;

safelyDefineCustomElement(PLAYER_TAG_NAME, Player);

declare global {
  interface HTMLElementTagNameMap {
    'vds-player': Player;
  }
}
