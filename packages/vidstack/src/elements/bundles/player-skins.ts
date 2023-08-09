import { defineCustomElement } from 'maverick.js/element';
import { MediaPlayerElement } from '../define/player-element';
import { MediaProviderElement } from '../define/provider-element';
import { MediaAudioUIElement } from '../define/skins/default/audio-ui-element';
import { MediaVideoUIElement } from '../define/skins/default/video-ui-element';
import { defineMediaUI } from './player-ui';

defineCustomElement(MediaPlayerElement);
defineCustomElement(MediaProviderElement);
defineCustomElement(MediaAudioUIElement);
defineCustomElement(MediaVideoUIElement);
defineMediaUI();
