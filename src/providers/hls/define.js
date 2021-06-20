import { safelyDefineCustomElement } from '../../utils/dom.js';
import { HlsElement, VDS_HLS_ELEMENT_TAG_NAME } from './HlsElement.js';

safelyDefineCustomElement(VDS_HLS_ELEMENT_TAG_NAME, HlsElement);
