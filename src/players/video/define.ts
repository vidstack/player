import { safelyDefineCustomElement } from '../../utils/dom';
import {
  VIDEO_PLAYER_ELEMENT_TAG_NAME,
  VideoPlayerElement
} from './VideoPlayerElement';

safelyDefineCustomElement(VIDEO_PLAYER_ELEMENT_TAG_NAME, VideoPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    [VIDEO_PLAYER_ELEMENT_TAG_NAME]: VideoPlayerElement;
  }
}
