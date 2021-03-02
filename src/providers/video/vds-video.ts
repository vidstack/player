import { LIB_PREFIX } from '../../shared/constants';
import { safelyDefineCustomElement } from '../../utils/dom';
import { VideoProvider } from './VideoProvider';

export const VIDEO_TAG_NAME = `${LIB_PREFIX}-video`;

safelyDefineCustomElement(VIDEO_TAG_NAME, VideoProvider);

declare global {
  interface HTMLElementTagNameMap {
    'vds-video': VideoProvider;
  }
}
