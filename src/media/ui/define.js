import { safelyDefineCustomElement } from '../../utils/dom.js';
import { MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement } from './MediaUiElement.js';

safelyDefineCustomElement(MEDIA_UI_ELEMENT_TAG_NAME, MediaUiElement);
