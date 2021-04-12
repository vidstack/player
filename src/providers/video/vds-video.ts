import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { VIDEO_ELEMENT_TAG_NAME } from './video.types';
import { VideoElement } from './VideoElement';

export const VDS_VIDEO_ELEMENT_TAG_NAME = `${LIB_PREFIX}-${VIDEO_ELEMENT_TAG_NAME}` as const;

safelyDefineCustomElement(VDS_VIDEO_ELEMENT_TAG_NAME, VideoElement);

declare global {
  interface HTMLElementTagNameMap {
    [VDS_VIDEO_ELEMENT_TAG_NAME]: VideoElement;
  }
}
