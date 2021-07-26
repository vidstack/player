import { VIDEO_ELEMENT_TAG_NAME, VideoElement } from './VideoElement';

window.customElements.define(VIDEO_ELEMENT_TAG_NAME, VideoElement);

declare global {
  interface HTMLElementTagNameMap {
    [VIDEO_ELEMENT_TAG_NAME]: VideoElement;
  }
}
