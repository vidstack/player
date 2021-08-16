import { safelyDefineCustomElement } from '../../utils/dom';
import {
  MEDIA_PLAYER_ELEMENT_TAG_NAME,
  MediaPlayerElement
} from './MediaPlayerElement';

safelyDefineCustomElement(MEDIA_PLAYER_ELEMENT_TAG_NAME, MediaPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    [MEDIA_PLAYER_ELEMENT_TAG_NAME]: MediaPlayerElement;
  }
}
