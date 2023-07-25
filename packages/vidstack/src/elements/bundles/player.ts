import { defineCustomElement } from 'maverick.js/element';
import { MediaProviderElement } from '..';
import { MediaPlayerElement } from '../define/player-element';
import { defineMediaUI } from './player-ui';

defineCustomElement(MediaPlayerElement);
defineCustomElement(MediaProviderElement);
defineMediaUI();
