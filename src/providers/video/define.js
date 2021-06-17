import { safelyDefineCustomElement } from '../../utils/dom';
import { VDS_VIDEO_ELEMENT_TAG_NAME, VideoElement } from './VideoElement';

safelyDefineCustomElement(VDS_VIDEO_ELEMENT_TAG_NAME, VideoElement);
