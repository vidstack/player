import { safelyDefineCustomElement } from '../../utils/dom.js';
import { VIDEO_ELEMENT_TAG_NAME, VideoElement } from './VideoElement.js';
safelyDefineCustomElement(VIDEO_ELEMENT_TAG_NAME, VideoElement);
