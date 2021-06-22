import { safelyDefineCustomElement } from '../../utils/dom.js';
import { VDS_VIDEO_ELEMENT_TAG_NAME, VideoElement } from './VideoElement.js';

safelyDefineCustomElement(VDS_VIDEO_ELEMENT_TAG_NAME, VideoElement);
