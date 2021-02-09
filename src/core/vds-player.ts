import { Player } from './Player';
import { safelyDefineCustomElement } from '../utils';
import { VIDSTACK_LIB_PREFIX } from '../shared/constants';

safelyDefineCustomElement(`${VIDSTACK_LIB_PREFIX}-player`, Player);
