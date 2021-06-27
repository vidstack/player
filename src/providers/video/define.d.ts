import { VIDEO_ELEMENT_TAG_NAME, VideoElement } from './VideoElement.js';

declare global {
  interface HTMLElementTagNameMap {
    [VIDEO_ELEMENT_TAG_NAME]: VideoElement;
  }
}
