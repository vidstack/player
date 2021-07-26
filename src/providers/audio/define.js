import { safelyDefineCustomElement } from '@utils/dom.js';
import { AUDIO_ELEMENT_TAG_NAME, AudioElement } from './AudioElement.js';

safelyDefineCustomElement(AUDIO_ELEMENT_TAG_NAME, AudioElement);
