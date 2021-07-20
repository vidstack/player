import { safelyDefineCustomElement } from '../../utils/dom.js';
import { HLS_ELEMENT_TAG_NAME, HlsElement } from './HlsElement.js';
safelyDefineCustomElement(HLS_ELEMENT_TAG_NAME, HlsElement);
