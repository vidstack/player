import { safelyDefineCustomElement } from '../../../utils/dom';
import {
  FAKE_MEDIA_PLAYER_ELEMENT_TAG_NAME,
  FakeMediaPlayerElement
} from './FakeMediaPlayerElement';

safelyDefineCustomElement(
  FAKE_MEDIA_PLAYER_ELEMENT_TAG_NAME,
  FakeMediaPlayerElement
);

declare global {
  interface HTMLElementTagNameMap {
    [FAKE_MEDIA_PLAYER_ELEMENT_TAG_NAME]: FakeMediaPlayerElement;
  }
}
