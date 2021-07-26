import { safelyDefineCustomElement } from '@utils/dom.js';
import { SCRIM_ELEMENT_TAG_NAME, ScrimElement } from './ScrimElement.js';

safelyDefineCustomElement(SCRIM_ELEMENT_TAG_NAME, ScrimElement);
