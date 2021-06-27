import { VDS_VIDEO_ELEMENT_TAG_NAME, VideoElement } from './VideoElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [VDS_VIDEO_ELEMENT_TAG_NAME]: VideoElement;
  }
}
