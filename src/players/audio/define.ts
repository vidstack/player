import { safelyDefineCustomElement } from '../../utils/dom';
import {
  AUDIO_PLAYER_ELEMENT_TAG_NAME,
  AudioPlayerElement
} from './AudioPlayerElement';

safelyDefineCustomElement(AUDIO_PLAYER_ELEMENT_TAG_NAME, AudioPlayerElement);

declare global {
  interface HTMLElementTagNameMap {
    [AUDIO_PLAYER_ELEMENT_TAG_NAME]: AudioPlayerElement;
  }
}
