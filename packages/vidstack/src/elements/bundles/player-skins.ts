import { defineCustomElement } from 'maverick.js/element';
import { MediaProviderElement } from '..';
import { MediaPlayerElement } from '../define/player-element';
import { MediaDefaultSkinElement } from '../define/skins/default-skin-element';
import { defineMediaUI } from './player-ui';

defineCustomElement(MediaPlayerElement);
defineCustomElement(MediaProviderElement);
defineCustomElement(MediaDefaultSkinElement);
defineMediaUI();
