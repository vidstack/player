import { safelyDefineCustomElement } from '@utils/dom';

import { VIDEO_ELEMENT_TAG_NAME, VideoElement } from './VideoElement';

safelyDefineCustomElement(VIDEO_ELEMENT_TAG_NAME, VideoElement);

declare global {
  interface HTMLElementTagNameMap {
    [VIDEO_ELEMENT_TAG_NAME]: VideoElement;
  }
}
