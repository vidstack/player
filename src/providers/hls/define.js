import { safelyDefineCustomElement } from '../../utils/dom';
import { VDS_HLS_ELEMENT_TAG_NAME } from './constants';
import { HlsElement } from './HlsElement';

safelyDefineCustomElement(VDS_HLS_ELEMENT_TAG_NAME, HlsElement);
