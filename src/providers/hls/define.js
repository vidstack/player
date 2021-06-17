import { safelyDefineCustomElement } from '../../utils/dom';
import { HlsElement, VDS_HLS_ELEMENT_TAG_NAME } from './HlsElement';

safelyDefineCustomElement(VDS_HLS_ELEMENT_TAG_NAME, HlsElement);
