import { safelyDefineCustomElement } from '../../utils/dom';
import { VDS_VIDEO_ELEMENT_TAG_NAME } from './constants';
import { VideoElement } from './VideoElement';

safelyDefineCustomElement(VDS_VIDEO_ELEMENT_TAG_NAME, VideoElement);
