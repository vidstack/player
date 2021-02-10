import { Player } from './Player';
import { safelyDefineCustomElement } from '../utils';
import { LIB_PREFIX } from '../shared/constants';

safelyDefineCustomElement(`${LIB_PREFIX}-player`, Player);
