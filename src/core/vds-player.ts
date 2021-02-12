import { Player } from './Player';
import { safelyDefineCustomElement } from '../utils';
import { LIB_PREFIX } from '../shared/constants';

export const PLAYER_TAG_NAME = `${LIB_PREFIX}-player`;

safelyDefineCustomElement(PLAYER_TAG_NAME, Player);

declare global {
  interface HTMLElementTagNameMap {
    'vds-player': Player;
  }
}
